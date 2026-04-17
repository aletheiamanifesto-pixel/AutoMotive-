import Link from "next/link";
import AdSpace from "@/components/ads/AdSpace";

const vehicles = [
  { id: "ferrari-f40", brand: "Ferrari", model: "F40", year: "1987-1992", hp: 478, weight: 1100, zero100: 3.8, topSpeed: 324, layout: "MR · V8 Biturbo", engineType: "Biturbo", score: 98 },
  { id: "ferrari-laferrari", brand: "Ferrari", model: "LaFerrari", year: "2013-2016", hp: 963, weight: 1255, zero100: 2.6, topSpeed: 352, layout: "MR · V12 Hybrid", engineType: "Hybrid", score: 97 },
  { id: "ferrari-sf90", brand: "Ferrari", model: "SF90 Stradale", year: "2019-", hp: 1000, weight: 1570, zero100: 2.5, topSpeed: 340, layout: "MR · V8 Hybrid AWD", engineType: "Hybrid", score: 96 },
  { id: "lamborghini-countach", brand: "Lamborghini", model: "Countach LP400", year: "1974-1990", hp: 375, weight: 1065, zero100: 5.4, topSpeed: 315, layout: "MR · V12 NA", engineType: "NA", score: 95 },
  { id: "lamborghini-aventador", brand: "Lamborghini", model: "Aventador SVJ", year: "2018-2022", hp: 770, weight: 1525, zero100: 2.8, topSpeed: 351, layout: "MR · V12 NA", engineType: "NA", score: 94 },
  { id: "porsche-911-gt3", brand: "Porsche", model: "911 GT3 (992)", year: "2021-", hp: 510, weight: 1418, zero100: 3.4, topSpeed: 318, layout: "RR · Boxer6 NA", engineType: "NA", score: 94 },
  { id: "mclaren-f1", brand: "McLaren", model: "F1", year: "1992-1998", hp: 627, weight: 1138, zero100: 3.2, topSpeed: 386, layout: "MR · V12 NA", engineType: "NA", score: 99 },
  { id: "mclaren-720s", brand: "McLaren", model: "720S", year: "2017-2022", hp: 720, weight: 1283, zero100: 2.9, topSpeed: 341, layout: "MR · V8 Biturbo", engineType: "Turbo", score: 93 },
  { id: "bugatti-chiron", brand: "Bugatti", model: "Chiron", year: "2016-", hp: 1500, weight: 1996, zero100: 2.4, topSpeed: 420, layout: "MR · W16 Quad-Turbo AWD", engineType: "Quad-Turbo", score: 97 },
  { id: "tesla-model-s-plaid", brand: "Tesla", model: "Model S Plaid", year: "2021-", hp: 1020, weight: 2162, zero100: 2.1, topSpeed: 322, layout: "AWD · Tri-Motor Electric", engineType: "Electric", score: 90 },
  { id: "nissan-gtr-nismo", brand: "Nissan", model: "GT-R Nismo", year: "2007-", hp: 600, weight: 1720, zero100: 2.5, topSpeed: 315, layout: "FR · V6 Biturbo AWD", engineType: "Biturbo", score: 89 },
  { id: "porsche-carrera-gt", brand: "Porsche", model: "Carrera GT", year: "2004-2007", hp: 612, weight: 1380, zero100: 3.5, topSpeed: 330, layout: "MR · V10 NA", engineType: "NA", score: 96 },
];

export default function VehiclesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-white mb-2">
            Database <span className="text-gradient">Veicoli</span>
          </h1>
          <p className="text-surface-400">
            Ogni auto analizzata come un vero ingegnere. Scegli e approfondisci.
          </p>
        </div>

        {/* Top ad */}
        <AdSpace type="banner" label="Brembo — L'eccellenza nella frenata" className="mb-8" />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.slice(0, 3).map((v) => (
            <VehicleCard key={v.id} {...v} />
          ))}
 
          {/* Native ad after 3rd card */}
          <div className="sm:col-span-2 lg:col-span-3">
            <AdSpace type="native" label="Sparco Racing — Abbigliamento tecnico con -25% per i membri AutoEngineer" />
          </div>

          {vehicles.slice(3, 9).map((v) => (
            <VehicleCard key={v.id} {...v} />
          ))}

          {/* Another ad mid-grid */}
          <div className="sm:col-span-2 lg:col-span-3">
            <AdSpace type="native" label="Fanatec — Volanti Direct Drive con sconto esclusivo" />
          </div>

          {vehicles.slice(9).map((v) => (
            <VehicleCard key={v.id} {...v} />
          ))}
        </div>
      </div>
    </div>
  );
}
