import Link from "next/link";

interface ExperienceCardProps {
  id: string; title: string; category: string; location: string; distance: string; date: string;
  priceNormal: number; priceDiscounted: number; discountPct: number; requiredLevel: number;
  slotsRemaining: number; rating: number; reviewCount: number; partnerName: string;
}

export default function ExperienceCard({ id, title, category, location, distance, date, priceNormal, priceDiscounted, discountPct, requiredLevel, slotsRemaining, rating, reviewCount, partnerName }: ExperienceCardProps) {
  const userLevel = 12;
  const isUnlocked = userLevel >= requiredLevel;
  const icons: Record<string, string> = { Track: "🏎️", Factory: "🏭", Workshop: "🔧", Motorsport: "🏁", Classic: "🚗", Museum: "🏛️" };
  return (
    <div className={`card-base group overflow-hidden flex flex-col ${!isUnlocked ? "opacity-75" : ""}`}> 
      <div className="relative w-full h-44 bg-gradient-to-br from-surface-700/40 to-surface-800/60 flex items-center justify-center">
        <span className="text-4xl opacity-20 group-hover:scale-110 transition-transform duration-500">{icons[category] || "🎟️"}</span>
        <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">-{discountPct}%</div>
        <div className="absolute top-3 right-3 bg-surface-900/80 backdrop-blur-sm text-surface-300 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg">{category}</div>
        {slotsRemaining <= 5 && <div className="absolute bottom-3 left-3 bg-amber-900/80 text-amber-400 text-xs font-medium px-2.5 py-1 rounded-lg">⏰ {slotsRemaining} posti rimasti</div>} 
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-surface-500 text-[11px] uppercase tracking-wider mb-1.5">{partnerName}</p>
        <h3 className="text-white font-bold text-base mb-2 group-hover:text-brand-400 transition-colors leading-snug">{title}</h3>
        <div className="flex items-center gap-3 text-surface-500 text-xs mb-4">
          <span>📍 {location}</span><span>·</span><span>{distance}</span><span>·</span><span>📅 {date}</span>
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-amber-500 text-sm">⭐</span>
          <span className="text-white text-sm font-bold">{rating}</span>
          <span className="text-surface-500 text-xs">({reviewCount} recensioni)</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-surface-500 text-xs line-through">€{priceNormal}</p>
            <p className="text-white text-2xl font-bold">€{priceDiscounted}<span className="text-emerald-500 text-sm font-medium ml-2">risparmi €{priceNormal - priceDiscounted}</span></p>
          </div>
        </div>
        {isUnlocked ? (
          <Link href={`/experiences/${id}`} className="btn-primary w-full text-center text-sm">Prenota Ora →</Link>
        ) : (
          <div className="bg-surface-900/60 border border-surface-700/50 rounded-xl px-4 py-3 text-center">
            <p className="text-surface-400 text-sm">🔒 Richiede <span className="text-amber-400 font-bold">Livello {requiredLevel}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}