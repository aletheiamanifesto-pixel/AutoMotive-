import Link from "next/link";
import CuriosityOfTheDay from "@/components/home/CuriosityOfTheDay";
import TrendingVehicles from "@/components/home/TrendingVehicles";
import WeeklyVersus from "@/components/home/WeeklyVersus";
import ProgressDashboard from "@/components/home/ProgressDashboard";
import AdSpace from "@/components/ads/AdSpace";

export default function Home() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative bg-hero-gradient overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-900/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-brand-950/60 border border-brand-900/40 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              <span className="text-brand-400 text-xs font-medium tracking-wide">
                Nuove 12 auto aggiunte questa settimana
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight animate-slide-up">
              Studia le Auto come un <span className="text-gradient">Vero Ingegnere</span>
            </h1>

            <p className="text-surface-400 text-lg sm:text-xl mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in">
              Ogni motore smontato. Ogni dato analizzato. Ogni segreto svelato.
              <br />
              <span className="text-surface-300">
                Poi sblocca esperienze reali con sconti fino al <span className="text-brand-400 font-semibold">50%</span>.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Link href="/vehicles" className="btn-primary text-base px-8 py-4">
                Esplora i Veicoli →
              </Link>
              <Link href="/experiences" className="btn-secondary text-base px-8 py-4">
                🎟️ Vedi Esperienze
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
              {[
                { value: "500+", label: "Auto Analizzate" },
                { value: "120+", label: "Esperienze" },
                { value: "15K+", label: "Ingegneri" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-heading text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-surface-500 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-950 to-transparent" />
      </section>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Top ad banner */}
        <AdSpace type="banner" label="Sponsored by Brembo" className="mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column (2/3) */}
          <div className="lg:col-span-2 space-y-10">
            <CuriosityOfTheDay />
            <TrendingVehicles />

            {/* Mid-content ad */}
            <AdSpace type="native" label="Fanatec DD Pro — Sconto 20% per i membri" />

            <WeeklyVersus />
          </div>

          {/* Sidebar (1/3) */}
          <aside className="space-y-8">
            <ProgressDashboard />

            {/* Sidebar ad */}
            <AdSpace type="sidebar" label="Sparco Racing Gear" />

            {/* Quick links */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-4">
                Accesso Rapido
              </h3>
              <div className="space-y-2">
                {[
                  { icon: "🔥", label: "Più viste questa settimana", href: "/vehicles?sort=trending" },
                  { icon: "⚡", label: "Ultime aggiunte", href: "/vehicles?sort=new" },
                  { icon: "🏎️", label: "Prossime esperienze", href: "/experiences" },
                  { icon: "💰", label: "Migliori sconti", href: "/deals" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-700/30 transition-colors group"
                  >
                    <span className="text-sm">{link.icon}</span>
                    <span className="text-sm text-surface-400 group-hover:text-surface-200 transition-colors">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Another sidebar ad */}
            <AdSpace type="sidebar" label="iRacing — 3 mesi gratis" />
          </aside>
        </div>
      </section>
    </div>
  );
}
