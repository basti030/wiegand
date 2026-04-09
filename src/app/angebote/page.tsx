import { Car, Zap, Shield, Video, ChevronRight, ArrowUpRight, CheckCircle2 } from "lucide-react";

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
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-dark text-white py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-12 bg-brand-orange"></span>
              <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-orange">Wiegand Deals</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 animate-fade-in leading-[0.9]">
              CHANCE AUF <br /><span className="text-brand-orange font-black italic">TOP-PREISE.</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium mb-12 max-w-2xl leading-relaxed">
              Entdecken Sie unsere aktuellen Angebote rund um SEAT, CUPRA und ŠKODA. 
              Vielfältig, transparent und fair – sichern Sie sich jetzt Ihren Traumwagen.
            </p>
          </div>
        </div>
        {/* Background Decorative */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-full bg-brand-orange/5 blur-[150px] pointer-events-none rounded-full"></div>
      </section>

      {/* Offers Dashboard */}
      <section className="py-32 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offerCategories.map((cat, idx) => (
              <a 
                key={idx} 
                href={cat.link}
                className="group bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 hover:border-brand-orange/20 hover:shadow-2xl hover:shadow-brand-orange/10 transition-all duration-500 flex flex-col justify-between min-h-[400px]"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-brand-gray flex items-center justify-center mb-8 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-inner">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tight mb-4 group-hover:text-brand-orange transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed mb-8">
                    {cat.description}
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {cat.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-brand-gray rounded-full text-[8px] font-black uppercase tracking-widest text-brand-dark/40 group-hover:bg-brand-orange/10 group-hover:text-brand-orange transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-brand-dark font-black uppercase tracking-widest text-[10px] group-hover:translate-x-2 transition-transform">
                    Angebote ansehen <ArrowUpRight size={14} className="text-brand-orange" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Performance Section (APR) */}
      <section className="py-32 bg-brand-gray/30 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-24">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
             <div className="space-y-10">
                <div className="inline-flex px-6 py-2 bg-brand-orange/10 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-orange">
                  CUPRA Performance Upgrade
                </div>
                <h2 className="text-4xl md:text-7xl font-black text-brand-dark uppercase tracking-tighter leading-[0.9]">
                  DEIN CUPRA <br /><span className="text-brand-orange italic">KANN MEHR.</span>
                </h2>
                <p className="text-gray-600 font-medium leading-relaxed text-lg max-w-xl">
                  Wir sind Ihr zertifizierter APR-Stützpunkt. Erleben Sie Performance-Lösungen, 
                  die perfekt auf Ihren Motor abgestimmt sind – inklusive voller Alltagstauglichkeit.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-brand-dark font-black uppercase tracking-widest text-[12px]">
                    <CheckCircle2 size={20} className="text-brand-orange" />
                    Chiptuning nach Maß
                  </div>
                  <div className="flex items-center gap-4 text-brand-dark font-black uppercase tracking-widest text-[12px]">
                    <CheckCircle2 size={20} className="text-brand-orange" />
                    Individuelle Hardware-Lösungen
                  </div>
                </div>
                <div className="pt-8">
                   <a href="/service" className="btn-primary px-12 py-6 text-sm font-black uppercase tracking-widest shadow-2xl shadow-brand-orange/20">
                    Mehr erfahren
                  </a>
                </div>
             </div>
          </div>
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
             <div className="relative rounded-[5rem] overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="/images/teaser-apr-tuning.jpg" 
                  alt="APR Performance Tuning" 
                  className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 scale-105 hover:scale-100"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Live Showroom Section */}
      <section className="py-32 bg-brand-dark relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-12">
           <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                DER VIRTUELLE <br /><span className="text-brand-orange">SHOWROOM.</span>
              </h2>
              <p className="text-gray-400 font-medium text-lg leading-relaxed">
                Keine Zeit für einen Besuch? Unsere Experten präsentieren Ihnen Ihr Wunschfahrzeug 
                live per Videoberatung. Ganz einfach, persönlich und unverbindlich.
              </p>
              <div className="pt-8 flex justify-center gap-6">
                 <a href="/termin" className="btn-primary px-12 py-6 text-sm font-black uppercase tracking-widest shadow-2xl shadow-brand-orange/20">
                    Video-Termin buchen
                 </a>
              </div>
           </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 blur-[100px] rounded-full"></div>
      </section>

      {/* Call to Action */}
      <section className="py-32">
        <div className="container mx-auto px-4 text-center">
           <div className="bg-brand-gray/20 rounded-[4rem] p-16 md:p-32 space-y-12">
              <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight">Nichts Passendes gefunden?</h3>
              <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
                Stöbern Sie in unserem gesamten Fahrzeugbestand oder kontaktieren Sie uns direkt. 
                Wir finden das passende Angebot für Sie.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                 <a href="/fahrzeuge" className="inline-flex items-center gap-4 group">
                    <span className="text-lg font-black uppercase tracking-widest text-brand-dark border-b-2 border-brand-dark/20 group-hover:border-brand-orange transition-all duration-300">Zum Fahrzeugbestand</span>
                    <ChevronRight size={24} className="text-brand-orange group-hover:translate-x-2 transition-transform" />
                 </a>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
