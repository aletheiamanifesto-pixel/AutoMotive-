export default function ProgressDashboard() {
  const user = {
    username: "turbo_fan_paolo", level: 12, xp: 8450, xpNextLevel: 10000,
    tier: "explorer" as const, streak: 12,
    badges: ["First Engine", "V8 Expert", "Aero Novice", "Quiz Master", "Week Streak"],
    experienceCredits: 2,
    nextUnlock: { name: "Lamborghini Accademia Imola", level: 15, saving: 451 },
  };
  const xpPct = Math.round((user.xp / user.xpNextLevel) * 100);
  const tierColors = { free: "text-surface-400", explorer: "text-amber-400", engineer: "text-brand-400", master: "text-purple-400" };
  return (
    <div className="card-highlight p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-bold text-sm border-2 border-brand-500/30">{user.level}</div>
        <div>
          <p className="text-white font-bold text-sm">@{user.username}</p>
          <p className={`text-xs font-medium capitalize ${tierColors[user.tier]}`}>✨ {user.tier}</p>
        </div>
        <div className="ml-auto text-right">
          <div className="flex items-center gap-1"><span className="text-orange-500">🔥</span><span className="text-white font-bold text-sm">{user.streak}</span></div>
          <span className="text-surface-500 text-[10px]">giorni</span>
        </div>
      </div>
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-surface-400 text-xs">Progresso al Lv.{user.level + 1}</span>
          <span className="text-amber-500 text-xs font-mono font-bold">{user.xp.toLocaleString()} / {user.xpNextLevel.toLocaleString()} XP</span>
        </div>
        <div className="h-2.5 bg-surface-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000" style={{ width: `${xpPct}%` }} />
        </div>
      </div>
      <div className="mb-5">
        <p className="text-surface-500 text-xs uppercase tracking-wider mb-2">Badge</p>
        <div className="flex flex-wrap gap-1.5">
          {user.badges.map((b) => <span key={b} className="text-[10px] bg-surface-800 border border-surface-700/50 text-surface-300 px-2 py-1 rounded-md">🏅 {b}</span>)}
        </div>
      </div>
      <div className="bg-surface-900/60 rounded-xl p-3.5 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-surface-400 text-xs">Experience Credits</span>
          <span className="text-emerald-400 font-bold text-sm">🎟️ {user.experienceCredits} disponibili</span>
        </div>
      </div>
      <div className="bg-brand-950/30 border border-brand-900/30 rounded-xl p-3.5">
        <p className="text-surface-500 text-[10px] uppercase tracking-wider mb-1.5">🔓 Prossimo sblocco</p>
        <p className="text-white text-sm font-semibold mb-1">{user.nextUnlock.name}</p>
        <p className="text-surface-400 text-xs">Al <span className="text-amber-400 font-bold">Livello {user.nextUnlock.level}</span> — risparmi <span className="text-emerald-400 font-bold">€{user.nextUnlock.saving}</span></p>
      </div>
    </div>
  );
}