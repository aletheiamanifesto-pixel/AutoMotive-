import Link from "next/link";

const trendingCars = [
  {
    id: "ferrari-sf90",
    name: "Ferrari SF90 Stradale",
    brand: "Ferrari",
    hp: 1000,
    weight: 1570,
    zero100: 2.5,
    topSpeed: 340,
    type: "Hybrid",
    score: 96,
  },
  {
    id: "porsche-911-gt3",
    name: "911 GT3 (992)",
    brand: "Porsche",
    hp: 510,
    weight: 1418,
    zero100: 3.4,
    topSpeed: 318,
    type: "NA",
    score: 94,
  },
  {
    id: "lamborghini-revuelto",
    name: "Revuelto",
    brand: "Lamborghini",
    hp: 1015,
    weight: 1772,
    zero100: 2.5,
    topSpeed: 350,
    type: "Hybrid",
    score: 95,
  },
  {
    id: "mclaren-720s",
    name: "720S",
    brand: "McLaren",
    hp: 720,
    weight: 1283,
    zero100: 2.9,
    topSpeed: 341,
    type: "Turbo",
    score: 93,
  },
];

export default function TrendingVehicles() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h2 className="text-lg font-bold text-white">Trending</h2>
        </div>
        <Link href="/vehicles" className="text-brand-500 hover:text-brand-400 text-sm font-medium transition-colors">
          Vedi tutti →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trendingCars.map((car) => (
          <Link key={car.id} href={`/vehicles/${car.id}`} className="card-base group p-5">
            {/* Image placeholder */}
            <div className="w-full h-36 bg-gradient-to-br from-surface-700/50 to-surface-800/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              <span className="text-4xl opacity-30 group-hover:scale-110 transition-transform duration-500">
                🏎️
              </span>
            </div>

            {/* Info */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-surface-500 text-xs font-medium uppercase tracking-wider mb-0.5">
                  {car.brand}
                </p>
                <h3 className="text-white font-bold group-hover:text-brand-400 transition-colors">
                  {car.name}
                </h3>
              </div>
              <span className="text-xs bg-brand-950/60 text-brand-400 border border-brand-900/40 px-2 py-1 rounded-lg font-mono">
                {car.score}/100
              </span>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "CV", value: car.hp },
                { label: "kg", value: car.weight },
                { label: "0-100", value: `${car.zero100}s` },
                { label: "km/h", value: car.topSpeed },
              ].map((stat) => (
                <div key={stat.label} className="text-center bg-surface-900/50 rounded-lg py-2">
                  <div className="text-white text-sm font-bold font-mono">{stat.value}</div>
                  <div className="text-surface-500 text-[10px] uppercase">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Type badge */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider bg-surface-800 text-surface-400 px-2 py-0.5 rounded">
                {car.type}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
