import ExperienceCard from "@/components/experiences/ExperienceCard";
import AdSpace from "@/components/ads/AdSpace";

const experiences = [
  { id: "ferrari-monza", title: "Ferrari 488 Challenge — Track Day", category: "Track", location: "Monza", distance: "45km", date: "12-13 Maggio", priceNormal: 899, priceDiscounted: 499, discountPct: 44, requiredLevel: 10, slotsRemaining: 6, rating: 4.9, reviewCount: 127, partnerName: "Puresport" },
  { id: "porsche-franciacorta", title: "Porsche Experience Center", category: "Track", location: "Franciacorta", distance: "95km", date: "Ogni weekend", priceNormal: 390, priceDiscounted: 249, discountPct: 36, requiredLevel: 5, slotsRemaining: 12, rating: 4.8, reviewCount: 89, partnerName: "Porsche Italia" },
  { id: "ferrari-museum", title: "Tour Fabbrica & Museo Ferrari", category: "Factory", location: "Maranello", distance: "180km", date: "Ogni giorno", priceNormal: 120, priceDiscounted: 69, discountPct: 42, requiredLevel: 3, slotsRemaining: 25, rating: 4.7, reviewCount: 312, partnerName: "Museo Ferrari" },
  { id: "pagani-tour", title: "Pagani Factory Tour Esclusivo", category: "Factory", location: "San Cesario", distance: "175km", date: "Ogni venerdì", priceNormal: 160, priceDiscounted: 99, discountPct: 38, requiredLevel: 10, slotsRemaining: 3, rating: 5.0, reviewCount: 64, partnerName: "Pagani Automobili" },
  { id: "build-engine", title: "Workshop: Smonta e Rimonta un Motore", category: "Workshop", location: "Torino", distance: "140km", date: "Ogni sabato", priceNormal: 299, priceDiscounted: 179, discountPct: 40, requiredLevel: 5, slotsRemaining: 8, rating: 4.8, reviewCount: 45, partnerName: "Officina Ingegneria" },
  { id: "f1-monza", title: "F1 GP Monza — Paddock VIP Access", category: "Motorsport", location: "Monza", distance: "45km", date: "5-7 Settembre", priceNormal: 2500, priceDiscounted: 1499, discountPct: 40, requiredLevel: 20, slotsRemaining: 4, rating: 5.0, reviewCount: 18, partnerName: "AutoEngineer Exclusive" },
];

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-white mb-2">
            Experience <span className="text-gradient">Marketplace</span>
          </h1>
          <p className="text-surface-400">
            Studia. Sali di livello. Sblocca esperienze reali con sconti fino al <span className="text-brand-400 font-semibold">50%</span>.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} {...exp} />
          ))}
        </div>
      </div>
    </div>
  );
}
