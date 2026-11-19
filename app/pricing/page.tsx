import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { PLANS } from "@/lib/domain/plans";

export const metadata: Metadata = { title: "Piani" };

const eur = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Scegli il tuo piano</h1>
        <p className="text-muted">Più sali di livello, più esperienze sblocchi.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.values(PLANS).map((p) => (
          <Card key={p.id} className={`flex flex-col ${p.popular ? "border-accent" : ""}`}>
            {p.popular && <p className="mb-2 text-xs font-semibold uppercase text-accent">Più scelto</p>}
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="my-3 font-mono text-3xl">
              {p.priceMonthlyEur === 0 ? "Gratis" : eur.format(p.priceMonthlyEur)}
              {p.priceMonthlyEur > 0 && <span className="text-sm text-muted">/mese</span>}
            </p>
            <ul className="mb-6 flex-1 space-y-2 text-sm">
              <li>XP ×{p.xpMultiplier}</li>
              <li>{p.monthlyExperienceCredits} crediti esperienza/mese</li>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {/* Il checkout Stripe arriva nel prossimo step (POST /api/stripe/checkout) */}
            <button disabled className="rounded-lg border border-border px-4 py-2 text-sm text-muted">
              {p.id === "free" ? "Inizia gratis" : "Presto disponibile"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
