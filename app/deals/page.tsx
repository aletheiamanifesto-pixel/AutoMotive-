import AdSpace from "@/components/ads/AdSpace";

const deals = [
  { id: "fanatec-dd-pro", title: "Fanatec Gran Turismo DD Pro", brand: "Fanatec", category: "Simulatori", priceNormal: 699.95, priceDiscounted: 559.96, discountPct: 20, tier: "explorer", description: "Volante Direct Drive con feedback force aptico." },
  { id: "thrustmaster-t300", title: "Thrustmaster T300 RS GT", brand: "Thrustmaster", category: "Simulatori", priceNormal: 399.99, priceDiscounted: 299.99, discountPct: 25, tier: "free", description: "Kit volante + pedaliera con force feedback." },
  { id: "sparco-tuta", title: "Sparco Victory 3.0 Suit", brand: "Sparco", category: "Abbigliamento", priceNormal: 599.00, priceDiscounted: 449.25, discountPct: 25, tier: "explorer", description: "Tuta omologata FIA 8856-2018." },
  { id: "omp-guanti", title: "OMP One-S Gloves", brand: "OMP", category: "Abbigliamento", priceNormal: 129.00, priceDiscounted: 96.75, discountPct: 25, tier: "free", description: "Guanti racing omologati FIA." },
  { id: "iracing-sub", title: "iRacing — 12 Mesi", brand: "iRacing", category: "Software", priceNormal: 110.00, priceDiscounted: 66.00, discountPct: 40, tier: "engineer", description: "La piattaforma di sim racing più realistica." },
  { id: "acc-ultimate", title: "Assetto Corsa Competizione Ultimate", brand: "Kunos", category: "Software", priceNormal: 59.99, priceDiscounted: 35.99, discountPct: 40, tier: "free", description: "Il simulatore GT3/GT4 definitivo." },
  { id: "beta-toolkit", title: "Beta Tools Racing Toolkit", brand: "Beta", category: "Utensili", priceNormal: 289.00, priceDiscounted: 231.20, discountPct: 20, tier: "explorer", description: "Set completo di chiavi professionali." },
  { id: "libro-dynamics", title: "Race Car Vehicle Dynamics", brand: "SAE", category: "Libri", priceNormal: 89.00, priceDiscounted: 62.30, discountPct: 30, tier: "free", description: "Il testo di riferimento. Milliken & Milliken." },
];

const categories = ["Tutti", "Simulatori", "Abbigliamento", "Software", "Utensili", "Libri"]; 

export default function DealsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-white mb-2">Deals & <span className="text-gradient">Sconti</span></h1>
          <p className="text-surface-400">Prodotti automotive selezionati con sconti esclusivi per i membri.</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button key={cat} className={`text-sm px-4 py-2 rounded-full transition-all ${cat === "Tutti" ? "bg-brand-700 text-white" : "bg-surface-800/60 text-surface-400 border border-surface-700/40 hover:text-white hover:border-surface-600"}`}> 
              {cat} 
            </button>
          ))}
        </div>
        <AdSpace type="banner" label="Fanatec Official Partner — Sconti esclusivi AutoEngineer" className="mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((deal) => (
            <div key={deal.id} className="card-base group flex flex-col overflow-hidden"> 
              <div className="relative w-full h-36 bg-gradient-to-br from-surface-700/40 to-surface-800/60 flex items-center justify-center"> 
                <span className="text-3xl opacity-20">📦</span>
                <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">-{deal.discountPct}%</div>
                {deal.tier !== "free" && (
                  <div className={`absolute top-2.5 right-2.5 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${deal.tier === "explorer" ? "badge-tier-explorer" : deal.tier === "engineer" ? "badge-tier-engineer" : "badge-tier-master"}`}> 
                    {deal.tier}
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1"> 
                <p className="text-surface-500 text-[10px] uppercase tracking-wider mb-1">{deal.brand} · {deal.category}</p>
                <h3 className="text-white font-bold text-sm mb-2 group-hover:text-brand-400 transition-colors">{deal.title}</h3>
                <p className="text-surface-500 text-xs leading-relaxed mb-4 flex-1">{deal.description}</p>
                <div className="flex items-baseline gap-2 mb-3"> 
                  <span className="text-surface-500 text-sm line-through">€{deal.priceNormal.toFixed(2)}</span>
                  <span className="text-white text-xl font-bold">€{deal.priceDiscounted.toFixed(2)}</span>
                </div>
                <button className="btn-primary w-full text-center text-xs !py-2.5">Ottieni Sconto →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}