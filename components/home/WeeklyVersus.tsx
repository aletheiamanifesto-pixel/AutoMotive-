import { useState } from "react";

export default function WeeklyVersus() {
  const [voted, setVoted] = useState<"a" | "b" | null>(null);
  const votesA = 847;
  const votesB = 792;
  const total = votesA + votesB;
  const pctA = Math.round((votesA / total) * 100);
  const pctB = 100 - pctA;

  return (
    <div className="card-base p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-lg">⚔️</span>
        <h2 className="text-lg font-bold text-white">Versus della Settimana</h2>
      </div>

      <h3 className="text-center text-surface-300 text-sm mb-6 font-medium">
        Turbo vs Aspirato Naturale — Chi ha la migliore <span className="text-white">erogazione di potenza</span>? 
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Car A */}
        <button
          onClick={() => setVoted("a")}
          className={`p-5 rounded-xl border-2 transition-all duration-300 text-left ${
            voted === "a"
              ? "border-brand-600 bg-brand-950/40 shadow-glow"
              : "border-surface-700/50 bg-surface-800/40 hover:border-surface-600"
          }`}
        >
          <div className="w-full h-24 bg-surface-900/50 rounded-lg mb-3 flex items-center justify-center">
            <span className="text-2xl opacity-40">🔴</span>
          </div>
          <p className="text-xs text-surface-500 uppercase tracking-wider">Ferrari</p>
          <p className="text-white font-bold text-sm">488 GTB</p>
          <p className="text-surface-500 text-xs mt-1">V8 Biturbo · 670 CV</p>
          {voted && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-brand-400 font-bold">{pctA}%</span>
                <span className="text-surface-500">{votesA} voti</span>
              </div>
              <div className="h-1.5 bg-surface-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-700 to-brand-500 rounded-full transition-all duration-1000"
                  style={{ width: `${pctA}%` }}
                />
              </div>
            </div>
          )}
        </button>

        {/* Car B */}
        <button
          onClick={() => setVoted("b")}
          className={`p-5 rounded-xl border-2 transition-all duration-300 text-left ${
            voted === "b"
              ? "border-amber-600 bg-amber-950/30 shadow-[0_0_20px_rgba(217,119,6,0.15)]"
              : "border-surface-700/50 bg-surface-800/40 hover:border-surface-600"
          }`}
        >
          <div className="w-full h-24 bg-surface-900/50 rounded-lg mb-3 flex items-center justify-center">
            <span className="text-2xl opacity-40">🟡</span>
          </div>
          <p className="text-xs text-surface-500 uppercase tracking-wider">Porsche</p>
          <p className="text-white font-bold text-sm">911 GT3 (992)</p>
          <p className="text-surface-500 text-xs mt-1">Boxer6 NA · 510 CV</p>
          {voted && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400 font-bold">{pctB}%</span>
                <span className="text-surface-500">{votesB} voti</span>
              </div>
              <div className="h-1.5 bg-surface-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-700 to-amber-500 rounded-full transition-all duration-1000"
                  style={{ width: `${pctB}%` }}
                />
              </div>
            </div>
          )}
        </button>
      </div>

      {voted ? (
        <p className="text-center text-surface-500 text-sm">
          Hai votato! <span className="text-brand-400">+30 XP</span> guadagnati 🎯
        </p>
      ) : (
        <p className="text-center text-surface-500 text-sm">
          Clicca per votare · <span className="text-surface-400">{total.toLocaleString()} voti totali</span>
        </p>
      )}
    </div>
  );
}
