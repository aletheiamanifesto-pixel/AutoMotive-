import Link from "next/link";

const plans = [
  {
    name: "Free", emoji: "🟢", priceMonthly: 0, priceYearly: 0,
    borderColor: "border-surface-700/50", bgColor: "bg-surface-800/40",
    ctaClass: "btn-secondary", popular: false,
    features: [
      { text: "5 schede auto al mese", included: true },
      { text: "Curiosità del giorno", included: true },
      { text: "1 confronto al mese", included: true },
      { text: "Sconti esperienze fino a -10%", included: true },
      { text: "Schede illimitate", included: false },
      { text: "Modelli 3D interattivi", included: false },
      { text: "Experience Credits", included: false },
      { text: "Accesso esperienze premium", included: false },
    ],
    xpMultiplier: "x1", credits: 0, maxDiscount: "10%",
  },
  {
    name: "Explorer", emoji: "🟡", priceMonthly: 9.99, priceYearly: 83.90,
    borderColor: "border-amber-800/50", bgColor: "bg-amber-950/20",
    ctaClass: "bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300",
    popular: true,
    features: [
      { text: "Schede illimitate", included: true },
      { text: "Confronti illimitati", included: true },
      { text: "Percorsi di studio", included: true },
      { text: "Community attiva", included: true },
      { text: "Sconti esperienze fino a -30%", included: true },
      { text: "1 Experience Credit/mese (€10)", included: true },
      { text: "Modelli 3D interattivi", included: false },
      { text: "Esperienze VIP/Motorsport", included: false },
    ],
    xpMultiplier: "x1.5", credits: 1, maxDiscount: "30%",
  },
  {
    name: "Engineer", emoji: "🔴", priceMonthly: 24.99, priceYearly: 209.90,
    borderColor: "border-brand-700/60", bgColor: "bg-brand-950/30",
    ctaClass: "btn-primary", popular: false,
    features: [
      { text: "Tutto di Explorer +", included: true },
      { text: "Modelli 3D esplosi", included: true },
      { text: "Simulazioni interattive", included: true },
      { text: "Sconti esperienze fino a -45%", included: true },
      { text: "3 Experience Credits/mese (€30)", included: true },
      { text: "Prenotazione prioritaria 24h", included: true },
      { text: "Certificazioni verificabili", included: true },
      { text: "Export PDF schede tecniche", included: true },
    ],
    xpMultiplier: "x2", credits: 3, maxDiscount: "45%",
  },
  {
    name: "Master", emoji: "⚫", priceMonthly: 49.99, priceYearly: 419.90,
    borderColor: "border-purple-800/50", bgColor: "bg-purple-950/20",
    ctaClass: "bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300",
    popular: false,
    features: [
      { text: "Tutto di Engineer +", included: true },
      { text: "Sconti esperienze fino a -50%", included: true },
      { text: "5 Experience Credits/mese (€50)", included: true },
      { text: "Tutte esperienze sbloccate", included: true },
      { text: "Esperienze ESCLUSIVE (F1, privati)", included: true },
      { text: "API access", included: true },
      { text: "Concierge dedicato", included: true },
      { text: "Inviti eventi privati", included: true },
    ],
    xpMultiplier: "x3", credits: 5, maxDiscount: "50%",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h1 className="font-heading text-3xl sm:text-4xl text-white mb-4">
            Scegli il Tuo <span className="text-gradient">Piano</span>
          </h1>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            Più studi, più risparmi. Ogni piano sblocca sconti maggiori su esperienze reali nel mondo automotive.
          </p>
          <div className="inline-flex items-center gap-3 mt-8 bg-surface-800/60 border border-surface-700/40 rounded-full p-1">
            <button className="bg-brand-700 text-white text-sm font-medium px-5 py-2 rounded-full">Mensile</button>
            <button className="text-surface-400 text-sm font-medium px-5 py-2 rounded-full hover:text-white transition-colors">
              Annuale <span className="text-emerald-500 text-xs font-bold">-30%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative flex flex-col rounded-2xl border ${plan.borderColor} ${plan.bgColor} backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-glow ${plan.popular ? "ring-2 ring-amber-600/50" : ""}`}> 
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Più Popolare
                </div>
              )} 
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{plan.emoji}</span>
                  <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-white text-3xl font-heading">
                    {plan.priceMonthly === 0 ? "Gratis" : `€${plan.priceMonthly}`}
                  </span>
                  {plan.priceMonthly > 0 && <span className="text-surface-500 text-sm">/mese</span>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="text-center bg-surface-900/40 rounded-lg py-2">
                  <div className="text-amber-500 text-sm font-bold font-mono">{plan.xpMultiplier}</div>
                  <div className="text-surface-500 text-[9px] uppercase">XP Speed</div>
                </div>
                <div className="text-center bg-surface-900/40 rounded-lg py-2">
                  <div className="text-emerald-500 text-sm font-bold font-mono">{plan.maxDiscount}</div>
                  <div className="text-surface-500 text-[9px] uppercase">Max Sconto</div>
                </div>
                <div className="text-center bg-surface-900/40 rounded-lg py-2">
                  <div className="text-brand-400 text-sm font-bold font-mono">{plan.credits}</div>
                  <div className="text-surface-500 text-[9px] uppercase">Credits</div>
                </div>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5">
                    {f.included ? <span className="text-emerald-500 text-sm mt-0.5">✓</span> : <span className="text-surface-600 text-sm mt-0.5">✕</span>}
                    <span className={`text-sm ${f.included ? "text-surface-300" : "text-surface-600"}`}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full text-center text-sm ${plan.ctaClass}`}> 
                {plan.priceMonthly === 0 ? "Inizia Gratis" : `Inizia ${plan.name}`}  
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}