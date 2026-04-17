import Link from "next/link";

interface VehicleCardProps {
  id: string;
  brand: string;
  model: string;
  year: string;
  hp: number;
  weight: number;
  zero100: number;
  topSpeed: number;
  layout: string;
  engineType: string;
  score: number;
}

export default function VehicleCard({ id, brand, model, year, hp, weight, zero100, topSpeed, layout, engineType, score }: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${id}`} className="card-base group p-5">  
      <div className="w-full h-36 bg-gradient-to-br from-surface-700/50 to-surface-800/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
        <span className="text-4xl opacity-30 group-hover:scale-110 transition-transform duration-500">🏎️</span>
      </div>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-surface-500 text-xs font-medium uppercase tracking-wider mb-0.5">{brand}</p>
          <h3 className="text-white font-bold group-hover:text-brand-400 transition-colors">{model}</h3>
          <p className="text-surface-600 text-xs">{year}</p>
        </div>
        <span className="text-xs bg-brand-950/60 text-brand-400 border border-brand-900/40 px-2 py-1 rounded-lg font-mono">{score}/100</span>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { label: "CV", value: hp },
          { label: "kg", value: weight },
          { label: "0-100", value: `${zero100}s` },
          { label: "km/h", value: topSpeed },
        ].map((stat) => (
          <div key={stat.label} className="text-center bg-surface-900/50 rounded-lg py-2"> 
            <div className="text-white text-sm font-bold font-mono">{stat.value}</div>
            <div className="text-surface-500 text-[10px] uppercase">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2"> 
        <span className="text-[10px] uppercase tracking-wider bg-surface-800 text-surface-400 px-2 py-0.5 rounded">{engineType}</span>
        <span className="text-[10px] text-surface-600">{layout}</span>
      </div>
    </Link>
  );
}