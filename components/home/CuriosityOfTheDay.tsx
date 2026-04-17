import Link from "next/link";

export default function CuriosityOfTheDay() {
  return (
    <div className="card-highlight p-6 sm:p-8 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-900/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">💡</span>
          <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">
            Curiosità del Giorno
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
          Lo sapevi che il Bugatti W16 ha <span className="text-gradient">64 valvole</span> e <span className="text-gradient">10 radiatori</span>? 
        </h2>

        <p className="text-surface-400 leading-relaxed mb-6">
          Un'auto normale ha 1 radiatore e 16 valvole. La Chiron ne ha 10 e 64. Il motore W16
          da 8 litri genera così tanto calore che servono 10 sistemi di raffreddamento separati per
          mantenere la temperatura ottimale di 90°C...
        </p>

        <div className="flex items-center gap-4">
          <Link href="/vehicles/bugatti-chiron" className="btn-primary text-sm !px-5 !py-2.5">
            Scopri tutto →
          </Link>
          <span className="text-surface-600 text-xs">
            🔥 1,247 persone hanno già letto
          </span>
        </div>
      </div>
    </div>
  );
}
