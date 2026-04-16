import Link from "next/link";

const footerLinks = {
  Piattaforma: [
    { href: "/vehicles", label: "Veicoli" },
    { href: "/compare", label: "Confronta" },
    { href: "/experiences", label: "Esperienze" },
    { href: "/deals", label: "Deals" },
    { href: "/community", label: "Community" },
  ],
  Risorse: [
    { href: "/about", label: "Chi siamo" },
    { href: "/partner", label: "Diventa Partner" },
    { href: "/api", label: "API" },
    { href: "/blog", label: "Blog" },
  ],
  Legale: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Termini di Servizio" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-surface-800/60 bg-surface-950">
      {/* Ad space banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="ad-space-banner mb-8">
          <span className="text-surface-600 text-xs uppercase tracking-widest">Partner Sponsor</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">AE</span>
              </div>
              <span className="font-heading text-base text-white">
                Auto<span className="text-brand-500">Engineer</span>
              </span>
            </div>
            <p className="text-surface-500 text-sm leading-relaxed mb-4">
              Studia le auto come un vero ingegnere. Sblocca esperienze reali nel mondo automotive.
            </p>
            <div className="flex gap-3">
              {['Instagram', 'YouTube', 'TikTok', 'Discord'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-surface-800/60 border border-surface-700/40 rounded-lg flex items-center justify-center text-surface-500 hover:text-brand-500 hover:border-brand-800/60 transition-all text-xs"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-surface-300 font-semibold text-sm mb-4 uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-surface-500 hover:text-surface-200 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-divider" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-surface-600 text-xs">
            © 2026 AutoEngineer Academy. Tutti i diritti riservati.
          </p>
          <p className="text-surface-700 text-xs">
            Fatto con 🏎️ per chi ama capire le auto
          </p>
        </div>
      </div>
    </footer>
  );
}
