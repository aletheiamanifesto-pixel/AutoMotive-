/**
 * Piani di abbonamento. Fonte unica di verità lato codice: la pagina /pricing,
 * il checkout Stripe e il moltiplicatore XP leggono tutti da qui.
 * Gli ID prezzo Stripe arrivano dalle variabili d'ambiente (diversi tra test e produzione).
 */

export const PLAN_IDS = ["free", "explorer", "engineer", "master"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export type Plan = {
  id: PlanId;
  name: string;
  priceMonthlyEur: number;
  /** Moltiplicatore applicato agli XP guadagnati. Deve coincidere con la tabella `plans` in SQL. */
  xpMultiplier: number;
  /** Crediti esperienza accreditati ogni mese. */
  monthlyExperienceCredits: number;
  features: string[];
  popular?: boolean;
  stripePriceEnv?: string;
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceMonthlyEur: 0,
    xpMultiplier: 1,
    monthlyExperienceCredits: 0,
    features: ["Schede veicolo base", "1 confronto al giorno", "Curiosità del giorno"],
  },
  explorer: {
    id: "explorer",
    name: "Explorer",
    priceMonthlyEur: 9.99,
    xpMultiplier: 1.25,
    monthlyExperienceCredits: 1,
    features: ["Schede tecniche complete", "Confronti illimitati", "Sconti partner fino al 10%"],
    stripePriceEnv: "STRIPE_PRICE_EXPLORER",
  },
  engineer: {
    id: "engineer",
    name: "Engineer",
    priceMonthlyEur: 24.99,
    xpMultiplier: 1.5,
    monthlyExperienceCredits: 3,
    features: ["Tutto di Explorer", "Accesso anticipato alle esperienze", "Sconti partner fino al 25%"],
    popular: true,
    stripePriceEnv: "STRIPE_PRICE_ENGINEER",
  },
  master: {
    id: "master",
    name: "Master",
    priceMonthlyEur: 49.99,
    xpMultiplier: 2,
    monthlyExperienceCredits: 8,
    features: ["Tutto di Engineer", "Esperienze esclusive in pista", "Sconti partner fino al 40%"],
    stripePriceEnv: "STRIPE_PRICE_MASTER",
  },
};

export function getPlan(id: string | null | undefined): Plan {
  return PLANS[(PLAN_IDS as readonly string[]).includes(id ?? "") ? (id as PlanId) : "free"];
}
