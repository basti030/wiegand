import { Car, Zap, Shield, Video, ChevronRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aktuelle Angebote | Autohaus Wiegand",
  description: "Entdecken Sie exklusive Angebote für Neuwagen, Gebrauchtwagen und erstklassigen Service beim Autohaus Wiegand in Büdingen und Gelnhausen.",
};

export default function AngebotePage() {
  const offerCategories = [
    {
      title: "Fahrzeugangebote",
      description: "Erstklassige Konditionen für Neu- und Gebrauchtwagen der Marken SEAT, CUPRA und ŠKODA.",
      icon: <Car size={32} />,
      link: "/fahrzeuge",
      tags: ["Leasing", "Finanzierung", "Kauf"]
    },
    {
      title: "APR Performance",
      description: "Holen Sie das Maximum aus Ihrem CUPRA. Professionelles Chiptuning und Hardware-Upgrades.",
      icon: <Zap size={32} />,
      link: "/service",
      tags: ["Tuning", "Leistung", "Garantie"]
    },
    {
      title: "Service-Specials",
      description: "Saisonale Werkstatt-Angebote, SEAT Care und Zubehör-Highlights zum Festpreis.",
      icon: <Shield size={32} />,
      link: "/service",
      tags: ["Wartung", "Check", "Original Teile"]
    },
    {
      title: "Video-Beratung",
      description: "Erleben Sie unsere Fahrzeuge digital. Beratung in Echtzeit bequem von zu Hause.",
      icon: <Video size={32} />,
      link: "/termin",
      tags: ["Live", "Digital", "Persönlich"]
    }
  ];

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {/* Hero Section */}
      <section className="bg-[#1A1A1A] text-white py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[2px] w-12 bg-[#FF5500]"></span>
              <span className="text-[14px] font-black uppercase tracking-[0.2em] text-[#FF5500]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Wiegand Deals</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-[1.05]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              CHANCE AUF <br /><span className="text-[#FF5500] font-black italic">TOP-PREISE.</span>
            </h1>
            <p className="text-[18px] text-gray-400 font-medium mb-12 max-w-2xl leading-relaxed">
              Entdecken Sie unsere aktuellen Angebote rund um SEAT, CUPRA und ŠKODA. 
              Vielfältig, transparent und fair – sichern Sie sich jetzt Ihren Traumwagen.
            </p>
          </div>
        </div>
        {/* Background Decorative */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-full bg-[#FF5500]/5 blur-[150px] pointer-events-none rounded-full"></div>
      </section>

      {/* Offers Dashboard */}
      <section className="py-24 -mt-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offerCategories.map((cat, idx) => (
              <a 
                key={idx} 
                href={cat.link}
                className="group bg-white p-10 border border-gray-200 hover:border-[#FF5500]/30 hover:shadow-2xl hover:shadow-[#FF5500]/10 transition-all duration-500 flex flex-col justify-between min-h-[400px] rounded-none"
              >
                <div>
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 flex items-center justify-center mb-8 text-[#FF5500] group-hover:bg-[#FF5500] group-hover:text-white transition-all duration-500">
                    {cat.icon}
                  </div>
                  <h3 className="text-[22px] font-black text-gray-900 uppercase tracking-tight mb-4 group-hover:text-[#FF5500] transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {cat.title}
                  </h3>
                  <p className="text-gray-600 font-medium leading-relaxed mb-8 text-[15px]">
                    {cat.description}
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {cat.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:bg-[#FF5500]/10 group-hover:text-[#FF5500] transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-gray-900 font-extrabold uppercase tracking-widest text-[12px] group-hover:translate-x-2 transition-transform" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Angebote ansehen <ArrowUpRight size={16} className="text-[#FF5500]" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Performance Section (APR) */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-24">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
             <div className="space-y-10">
                <div className="inline-flex px-6 py-2 bg-[#FF5500]/10 text-[11px] font-extrabold uppercase tracking-widest text-[#FF5500]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  CUPRA Performance Upgrade
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-gray-950 uppercase tracking-tighter leading-[1.05]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  DEIN CUPRA <br /><span className="text-[#FF5500] italic">KANN MEHR.</span>
                </h2>
                <p className="text-gray-600 font-medium leading-relaxed text-[16px] max-w-xl">
                  Wir sind Ihr zertifizierter APR-Stützpunkt. Erleben Sie Performance-Lösungen, 
                  die perfekt auf Ihren Motor abgestimmt sind – inklusive voller Alltagstauglichkeit.
                </p>
                <div className="space-y-4 font-bold text-gray-900 text-[14px]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <div className="flex items-center gap-4 uppercase tracking-widest">
                    <CheckCircle2 size={20} className="text-[#FF5500]" />
                    Chiptuning nach Maß
                  </div>
                  <div className="flex items-center gap-4 uppercase tracking-widest">
                    <CheckCircle2 size={20} className="text-[#FF5500]" />
                    Individuelle Hardware-Lösungen
                  </div>
                </div>
                <div className="pt-8">
                   <a href="/service" className="inline-block bg-[#FF5500] hover:bg-[#e04a00] text-white font-bold text-[14px] uppercase tracking-widest px-10 py-4 rounded-[30px] shadow-md transition-all">
                     Mehr erfahren
                   </a>
                </div>
             </div>
          </div>
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
             <div className="relative overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src="/images/teaser-apr-tuning.jpg" 
                  alt="APR Performance Tuning" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Live Showroom Section */}
      <section className="py-32 bg-[#1A1A1A] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-12">
           <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[1.05]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                DER VIRTUELLE <br /><span className="text-[#FF5500]">SHOWROOM.</span>
              </h2>
              <p className="text-gray-400 font-medium text-[16px] leading-relaxed">
                Keine Zeit für einen Besuch? Unsere Experten präsentieren Ihnen Ihr Wunschfahrzeug 
                live per Videoberatung. Ganz einfach, persönlich und unverbindlich.
              </p>
              <div className="pt-8 flex justify-center gap-6">
                 <a href="/termin" className="inline-block bg-[#FF5500] hover:bg-[#e04a00] text-white font-bold text-[14px] uppercase tracking-widest px-10 py-4 rounded-[30px] shadow-md transition-all">
                    Video-Termin buchen
                 </a>
              </div>
           </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF5500]/10 blur-[100px] rounded-full"></div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 text-center">
           <div className="bg-gray-50 border border-gray-100 p-16 md:p-24 space-y-12 rounded-none">
              <h3 className="text-[28px] font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>Nichts Passendes gefunden?</h3>
              <p className="text-gray-600 font-medium max-w-2xl mx-auto text-[16px] leading-relaxed">
                Stöbern Sie in unserem gesamten Fahrzeugbestand oder kontaktieren Sie uns direkt. 
                Wir finden das passende Angebot für Sie.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                 <a href="/fahrzeuge" className="inline-flex items-center gap-4 group">
                    <span className="text-[14px] font-extrabold uppercase tracking-widest text-gray-950 border-b-2 border-gray-200 group-hover:border-[#FF5500] transition-all duration-300" style={{ fontFamily: "'Montserrat', sans-serif" }}>Zum Fahrzeugbestand</span>
                    <ChevronRight size={24} className="text-[#FF5500] group-hover:translate-x-2 transition-transform" />
                 </a>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
