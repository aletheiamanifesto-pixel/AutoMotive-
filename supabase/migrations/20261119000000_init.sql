-- AutoEngineer Academy — schema iniziale
-- Principio: il client legge tramite RLS; tutto ciò che vale soldi o punti
-- (XP, livelli, crediti, piano, prenotazioni) si modifica SOLO tramite funzioni
-- SECURITY DEFINER o dal webhook Stripe con service role.


-- ───────────────────────── Piani ─────────────────────────
-- Deve restare allineata a lib/domain/plans.ts (verificato da tests/sql-sync.test.ts)
create table public.plans (
  id text primary key,
  xp_multiplier numeric(4,2) not null,
  monthly_experience_credits int not null
);

insert into public.plans (id, xp_multiplier, monthly_experience_credits) values
  ('free', 1.00, 0),
  ('explorer', 1.25, 1),
  ('engineer', 1.50, 3),
  ('master', 2.00, 8);

-- ───────────────────────── Profili ─────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Pilota',
  avatar_url text,
  plan_id text not null default 'free' references public.plans (id),
  xp int not null default 0 check (xp >= 0),
  streak int not null default 0,
  last_active_day date,
  experience_credits int not null default 0 check (experience_credits >= 0),
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

-- Crea il profilo alla registrazione
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', 'Pilota'));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Livello: stessa formula di lib/domain/gamification.ts → levelFromXp
create function public.level_from_xp(p_xp int) returns int
language sql immutable as $$
  select least(30, floor(sqrt(greatest(p_xp, 0) / 100.0))::int + 1)
$$;

-- ───────────────────────── Veicoli ─────────────────────────
create table public.vehicles (
  id text primary key,
  slug text not null unique,
  brand text not null,
  model text not null,
  year int not null,
  body_type text not null check (body_type in ('coupe','berlina','suv','spider','hatchback','hypercar')),
  segment text not null check (segment in ('sportiva','supercar','hypercar','gt','premium','utilitaria')),
  layout text not null check (layout in ('FR','MR','RR','FF','AWD')),
  powertrain text not null check (powertrain in ('termico','ibrido','plug-in','elettrico')),
  power_hp numeric not null check (power_hp > 0),
  weight_kg numeric not null check (weight_kg > 0),
  zero_to_hundred_s numeric not null check (zero_to_hundred_s > 0),
  top_speed_kmh numeric not null check (top_speed_kmh > 0),
  price_eur numeric,
  image_url text,
  specs jsonb not null, -- validato da vehicleSpecsSchema (zod) in lettura
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index vehicles_brand_idx on public.vehicles (brand);
create index vehicles_segment_idx on public.vehicles (segment);

-- ───────────────────────── Gamification ─────────────────────────
-- Allineata a XP_ACTIONS in lib/domain/gamification.ts
create table public.xp_rules (
  action text primary key,
  xp int not null check (xp > 0),
  daily_cap int not null check (daily_cap > 0)
);

insert into public.xp_rules (action, xp, daily_cap) values
  ('read_vehicle', 10, 20),
  ('complete_quiz', 50, 5),
  ('compare_vehicles', 15, 10),
  ('vote_versus', 20, 1),
  ('daily_login', 25, 1),
  ('book_experience', 200, 3);

create table public.xp_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  action text not null references public.xp_rules (action),
  xp int not null,
  ref_id text, -- es. slug del veicolo letto, per evitare doppi conteggi
  created_at timestamptz not null default now()
);
create index xp_events_user_day_idx on public.xp_events (user_id, action, created_at);
-- Lo stesso contenuto (es. lo stesso veicolo) dà XP una sola volta per utente
create unique index xp_events_once_per_ref on public.xp_events (user_id, action, ref_id) where ref_id is not null;

create table public.badges (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null
);

create table public.user_badges (
  user_id uuid references public.profiles (id) on delete cascade,
  badge_id text references public.badges (id),
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

/**
 * Unico punto di ingresso per assegnare XP. Chiamata dal server con il client dell'utente
 * (supabase.rpc('award_xp', ...)): l'utente è preso da auth.uid(), mai da un parametro.
 * Le giornate sono in UTC (semplificazione MVP).
 */
create function public.award_xp(p_action text, p_ref_id text default null)
returns table (xp_awarded int, total_xp int, streak int, level int)
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_rule public.xp_rules;
  v_profile public.profiles;
  v_today date := (now() at time zone 'utc')::date;
  v_count int;
  v_amount int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select * into v_rule from public.xp_rules r where r.action = p_action;
  if not found then raise exception 'unknown action %', p_action; end if;

  -- lock della riga profilo: serializza le chiamate concorrenti dello stesso utente
  select * into v_profile from public.profiles p where p.id = v_uid for update;

  select count(*) into v_count from public.xp_events e
  where e.user_id = v_uid and e.action = p_action
    and e.created_at >= v_today and e.created_at < v_today + 1;

  if v_count >= v_rule.daily_cap
     or (p_ref_id is not null and exists (
       select 1 from public.xp_events e
       where e.user_id = v_uid and e.action = p_action and e.ref_id = p_ref_id)) then
    return query select 0, v_profile.xp, v_profile.streak, public.level_from_xp(v_profile.xp);
    return;
  end if;

  select round(v_rule.xp * pl.xp_multiplier)::int into v_amount
  from public.plans pl where pl.id = v_profile.plan_id;

  insert into public.xp_events (user_id, action, xp, ref_id) values (v_uid, p_action, v_amount, p_ref_id);

  update public.profiles p set
    xp = p.xp + v_amount,
    streak = case
      when p.last_active_day = v_today then p.streak
      when p.last_active_day = v_today - 1 then p.streak + 1
      else 1 end,
    last_active_day = v_today
  where p.id = v_uid
  returning * into v_profile;

  return query select v_amount, v_profile.xp, v_profile.streak, public.level_from_xp(v_profile.xp);
end $$;

-- Classifica pubblica: espone solo campi non sensibili.
create view public.leaderboard as
  select id as user_id, display_name, avatar_url, xp, public.level_from_xp(xp) as level
  from public.profiles
  order by xp desc
  limit 100;

-- ───────────────────────── Esperienze ─────────────────────────
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  category text not null check (category in ('pista','fabbrica','museo','guida','evento')),
  location text not null,
  starts_at timestamptz not null,
  original_price_eur numeric not null check (original_price_eur >= 0),
  discounted_price_eur numeric not null check (discounted_price_eur >= 0),
  credits_cost int not null default 1 check (credits_cost >= 0),
  required_level int not null default 1,
  spots_total int not null check (spots_total > 0),
  spots_taken int not null default 0,
  image_url text,
  published boolean not null default true,
  check (spots_taken between 0 and spots_total),
  check (discounted_price_eur <= original_price_eur)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  experience_id uuid not null references public.experiences (id),
  status text not null default 'requested' check (status in ('requested','confirmed','cancelled')),
  created_at timestamptz not null default now(),
  unique (user_id, experience_id)
);

/** Prenotazione atomica: controlla livello, crediti e posti nella stessa transazione. */
create function public.book_experience(p_experience_id uuid)
returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_exp public.experiences;
  v_profile public.profiles;
  v_booking_id uuid;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select * into v_exp from public.experiences e where e.id = p_experience_id and e.published for update;
  if not found then raise exception 'experience not found'; end if;

  select * into v_profile from public.profiles p where p.id = v_uid for update;

  if public.level_from_xp(v_profile.xp) < v_exp.required_level then raise exception 'level too low'; end if;
  if v_profile.experience_credits < v_exp.credits_cost then raise exception 'not enough credits'; end if;
  if v_exp.spots_taken >= v_exp.spots_total then raise exception 'sold out'; end if;
  if v_exp.starts_at <= now() then raise exception 'experience already started'; end if;

  insert into public.bookings (user_id, experience_id) values (v_uid, p_experience_id)
  returning id into v_booking_id;

  update public.experiences set spots_taken = spots_taken + 1 where id = p_experience_id;
  update public.profiles set experience_credits = experience_credits - v_exp.credits_cost where id = v_uid;

  return v_booking_id;
end $$;

-- ───────────────────────── Offerte e community ─────────────────────────
create table public.deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  partner text not null,
  url text not null,
  discount_percent int not null check (discount_percent between 1 and 90),
  min_plan_id text not null default 'free' references public.plans (id),
  expires_at timestamptz,
  published boolean not null default true
);

create table public.versus (
  id uuid primary key default gen_random_uuid(),
  week_start date not null unique,
  vehicle_a_id text not null references public.vehicles (id),
  vehicle_b_id text not null references public.vehicles (id),
  question text not null,
  check (vehicle_a_id <> vehicle_b_id)
);

create table public.versus_votes (
  versus_id uuid references public.versus (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete cascade,
  vehicle_id text not null references public.vehicles (id),
  created_at timestamptz not null default now(),
  primary key (versus_id, user_id)
);

-- ───────────────────────── Abbonamenti (scritti solo dal webhook) ─────────────────────────
create table public.subscriptions (
  id text primary key, -- id abbonamento Stripe
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_id text not null references public.plans (id),
  status text not null,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

-- Idempotenza webhook: Stripe può consegnare lo stesso evento più volte
create table public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

-- ───────────────────────── RLS ─────────────────────────
alter table public.plans enable row level security;
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.xp_rules enable row level security;
alter table public.xp_events enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.experiences enable row level security;
alter table public.bookings enable row level security;
alter table public.deals enable row level security;
alter table public.versus enable row level security;
alter table public.versus_votes enable row level security;
alter table public.subscriptions enable row level security;
alter table public.stripe_events enable row level security; -- nessuna policy: solo service role

-- Contenuti pubblici in sola lettura
create policy "plans leggibili" on public.plans for select using (true);
create policy "veicoli pubblicati" on public.vehicles for select using (published);
create policy "regole xp leggibili" on public.xp_rules for select using (true);
create policy "badge leggibili" on public.badges for select using (true);
create policy "esperienze pubblicate" on public.experiences for select using (published);
create policy "offerte pubblicate" on public.deals for select using (published);
create policy "versus leggibili" on public.versus for select using (true);

-- Dati personali: solo il proprietario
create policy "profilo proprio" on public.profiles for select using (auth.uid() = id);
create policy "modifica profilo proprio" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "eventi xp propri" on public.xp_events for select using (auth.uid() = user_id);
create policy "badge propri" on public.user_badges for select using (auth.uid() = user_id);
create policy "prenotazioni proprie" on public.bookings for select using (auth.uid() = user_id);
create policy "abbonamento proprio" on public.subscriptions for select using (auth.uid() = user_id);
create policy "voti propri" on public.versus_votes for select using (auth.uid() = user_id);
create policy "vota una volta" on public.versus_votes for insert with check (auth.uid() = user_id);

-- Sul profilo l'utente può cambiare SOLO nome e avatar (non xp, piano, crediti)
revoke update on public.profiles from authenticated, anon;
grant update (display_name, avatar_url) on public.profiles to authenticated;

-- Le funzioni critiche sono chiamabili solo da utenti autenticati
revoke execute on function public.award_xp(text, text) from public, anon;
grant execute on function public.award_xp(text, text) to authenticated;
revoke execute on function public.book_experience(uuid) from public, anon;
grant execute on function public.book_experience(uuid) to authenticated;
