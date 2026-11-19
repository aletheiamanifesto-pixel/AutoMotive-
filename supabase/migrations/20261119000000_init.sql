-- AutoEngineer Academy — schema iniziale
-- Principio: il client legge tramite RLS; le prenotazioni si creano SOLO tramite
-- la funzione SECURITY DEFINER book_experience (controllo posti atomico).

-- ───────────────────────── Profili ─────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Pilota',
  avatar_url text,
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

/** Prenotazione atomica: controlla posti e data nella stessa transazione (niente overbooking). */
create function public.book_experience(p_experience_id uuid)
returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_exp public.experiences;
  v_booking_id uuid;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select * into v_exp from public.experiences e where e.id = p_experience_id and e.published for update;
  if not found then raise exception 'experience not found'; end if;

  if v_exp.spots_taken >= v_exp.spots_total then raise exception 'sold out'; end if;
  if v_exp.starts_at <= now() then raise exception 'experience already started'; end if;

  insert into public.bookings (user_id, experience_id) values (v_uid, p_experience_id)
  returning id into v_booking_id;

  update public.experiences set spots_taken = spots_taken + 1 where id = p_experience_id;

  return v_booking_id;
end $$;

-- ───────────────────────── Offerte e community ─────────────────────────
create table public.deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  partner text not null,
  url text not null,
  discount_percent int not null check (discount_percent between 1 and 90),
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

-- ───────────────────────── RLS ─────────────────────────
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.experiences enable row level security;
alter table public.bookings enable row level security;
alter table public.deals enable row level security;
alter table public.versus enable row level security;
alter table public.versus_votes enable row level security;

-- Contenuti pubblici in sola lettura
create policy "veicoli pubblicati" on public.vehicles for select using (published);
create policy "esperienze pubblicate" on public.experiences for select using (published);
create policy "offerte pubblicate" on public.deals for select using (published);
create policy "versus leggibili" on public.versus for select using (true);

-- Dati personali: solo il proprietario
create policy "profilo proprio" on public.profiles for select using (auth.uid() = id);
create policy "modifica profilo proprio" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "prenotazioni proprie" on public.bookings for select using (auth.uid() = user_id);
create policy "voti propri" on public.versus_votes for select using (auth.uid() = user_id);
create policy "vota una volta" on public.versus_votes for insert with check (auth.uid() = user_id);

-- Sul profilo l'utente può cambiare SOLO nome e avatar
revoke update on public.profiles from authenticated, anon;
grant update (display_name, avatar_url) on public.profiles to authenticated;

-- La prenotazione è chiamabile solo da utenti autenticati
revoke execute on function public.book_experience(uuid) from public, anon;
grant execute on function public.book_experience(uuid) to authenticated;
