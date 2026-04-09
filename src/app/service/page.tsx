import { Shield, Wrench, Wind, Zap, Activity, Calendar, Car, Clock, CheckCircle2, ChevronRight, Settings, Phone, MessageSquare } from "lucide-react";

export default function ServicePage() {
  const servicePortfolio = [
    {
      icon: <Activity size={32} />,
      title: "Inspektion & Wartung",
      description: "Professioneller Service streng nach Herstellervorgaben für Werterhalt und Sicherheit.",
      highlights: ["Mobilitätsgarantie", "Digitale Servicehistorie", "Fachpersonal"]
    },
    {
      icon: <Settings size={32} />,
      title: "Räder & Reifen",
      description: "Saisonaler Wechsel, professionelle Einlagerung und modernste Wuchttechnik.",
      highlights: ["Reifengarantie", "Profil-Check", "Reinigung"]
    },
    {
      icon: <Wind size={32} />,
      title: "Klimaservice",
      description: "Desinfektion und Kältemittel-Check für frische Luft und optimale Kühlleistung.",
      highlights: ["Pollenfilter-Tausch", "Dichtigkeitsprüfung"]
    },
    {
      icon: <Shield size={32} />,
      title: "Glasservice",
      description: "Steinschlagreparatur oder Scheibentausch – schnell und unkompliziert.",
      highlights: ["Kostenlos bei Teilkasko*", "Original-Glas"]
    },
    {
      icon: <CheckCircle2 size={32} />,
      title: "HU / AU",
      description: "Tägliche Abnahme durch anerkannte Prüforganisationen direkt bei uns im Haus.",
      highlights: ["Vorab-Check inklusive", "Direkte Mängelbehebung"]
    },
    {
      icon: <Zap size={32} />,
      title: "E-Mobilität Service",
      description: "Spezialisierte Wartung für Elektro- und Hybridfahrzeuge durch zertifizierte Hochvolt-Techniker.",
      highlights: ["Batterie-Check", "Ladeinfrastruktur-Info"]
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
              <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-orange">Wiegand Service</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 animate-fade-in leading-[0.9]">
              EXZELLENZ IN <br /><span className="text-brand-orange">JEDER FASER.</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium mb-12 max-w-2xl leading-relaxed">
              Ihr Fahrzeug verdient den besten Service. Bei Auto Wiegand kombinieren wir 
              jahrzehntelange Erfahrung mit modernster Diagnose-Technologie und höchster Präzision.
            </p>
            <div className="flex flex-wrap gap-6">
              <a href="/termin" className="btn-primary px-12 py-6 text-sm font-black uppercase tracking-widest shadow-2xl shadow-brand-orange/20">
                Termin online buchen
              </a>
              <a href="#portfolio" className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px] hover:text-brand-orange transition-colors">
                Leistungen entdecken <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
        {/* Background Decorative */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-full bg-brand-orange/5 blur-[150px] pointer-events-none rounded-full"></div>
      </section>

      {/* Service Locations Section */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Büdingen Column */}
            <div className="space-y-10 group">
              <div className="relative rounded-[3rem] overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-700 aspect-[16/7]">
                <img 
                  src="/images/service.jpg" 
                  alt="Service Team Büdingen" 
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 to-transparent"></div>
              </div>
              <div className="space-y-6 px-4">
                <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Service Büdingen</h3>
                <div className="space-y-4">
                  <a href="https://wiegand.seat.de/services" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-brand-orange font-black uppercase tracking-widest text-[12px] group/link">
                    <span className="w-8 h-px bg-brand-orange/20 group-hover/link:w-12 group-hover/link:bg-brand-orange transition-all"></span>
                    » Service SEAT Büdingen
                  </a>
                  <a href="https://wiegand.cupra.de/services" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-brand-orange font-black uppercase tracking-widest text-[12px] group/link">
                    <span className="w-8 h-px bg-brand-orange/20 group-hover/link:w-12 group-hover/link:bg-brand-orange transition-all"></span>
                    » Service CUPRA Büdingen
                  </a>
                </div>
              </div>
            </div>

            {/* Gelnhausen Column */}
            <div className="space-y-10 group">
              <div className="relative rounded-[3rem] overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-700 aspect-[16/7]">
                <img 
                  src="/images/service.jpg" 
                  alt="Service Team Gelnhausen" 
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 to-transparent"></div>
              </div>
              <div className="space-y-6 px-4">
                <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Service Gelnhausen</h3>
                <div className="space-y-4">
                  <a href="https://seat-wiegand-gelnhausen.de/services" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-brand-orange font-black uppercase tracking-widest text-[12px] group/link">
                    <span className="w-8 h-px bg-brand-orange/20 group-hover/link:w-12 group-hover/link:bg-brand-orange transition-all"></span>
                    » Service SEAT Gelnhausen
                  </a>
                  <a href="https://wiegand-gelnhausen.cupra.de/services" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-brand-orange font-black uppercase tracking-widest text-[12px] group/link">
                    <span className="w-8 h-px bg-brand-orange/20 group-hover/link:w-12 group-hover/link:bg-brand-orange transition-all"></span>
                    » Service CUPRA Gelnhausen
                  </a>
                  <a href="https://wiegand.skoda-auto.de/index_haendler.php?e=6-15" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-brand-orange font-black uppercase tracking-widest text-[12px] group/link">
                    <span className="w-8 h-px bg-brand-orange/20 group-hover/link:w-12 group-hover/link:bg-brand-orange transition-all"></span>
                    » Service SKODA Gelnhausen
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Portfolio Grid */}
      <section id="portfolio" className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tight">Unsere Service-Leistungen</h2>
              <div className="h-1.5 w-24 bg-brand-orange rounded-full"></div>
            </div>
            <p className="text-gray-500 font-bold max-w-md leading-relaxed">
              Von der klassischen Wartung bis hin zu hochspezialisierten technischen Lösungen – 
              unser Portfolio deckt alle Bedürfnisse Ihres Fahrzeugs ab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicePortfolio.map((service, idx) => (
              <div key={idx} className="group bg-white rounded-[3rem] p-12 border border-gray-100 hover:border-brand-orange/20 shadow-sm hover:shadow-2xl hover:shadow-brand-orange/10 transition-all duration-500">
                <div className="w-20 h-20 rounded-3xl bg-brand-gray flex items-center justify-center mb-10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-inner">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tight mb-4 group-hover:text-brand-orange transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-brand-dark/60">
                      <CheckCircle2 size={12} className="text-brand-orange" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium USPs (Hol- & Bring Service) */}
      <section className="py-32 bg-brand-dark relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-24">
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white/5 group">
              <img 
                src="https://www.auto-wiegand.de/media/image/header-der-betrieb.jpg" 
                alt="Wiegand Service Quality" 
                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-2xl bg-brand-orange flex items-center justify-center text-white">
                      <Car size={24} />
                   </div>
                   <h4 className="text-2xl font-black text-white uppercase tracking-tight">Hol- und Bringservice</h4>
                </div>
                <p className="text-gray-300 font-medium">Sparen Sie Zeit – wir holen Ihr Fahrzeug bei Ihnen ab und bringen es gewartet zurück.</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 text-white space-y-12">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
              KOMFORT AUF <br /><span className="text-brand-orange">MASTER-LEVEL.</span>
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-16 h-16 shrink-0 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-brand-orange">
                  <Clock size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tight mb-2">Maximale Zeitersparnis</h4>
                  <p className="text-gray-400 font-medium leading-relaxed">Nutzen Sie unseren bequemen Hol- und Bringservice oder einen unserer Ersatzwagen.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-16 h-16 shrink-0 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-brand-orange">
                  <Shield size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tight mb-2">Original Teile Garantie</h4>
                  <p className="text-gray-400 font-medium leading-relaxed">Wir verwenden ausschließlich Original-Ersatzteile für maximale Sicherheit und Werterhalt.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-16 h-16 shrink-0 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-brand-orange">
                   <Wrench size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tight mb-2">Top-Ausgebildete Meister</h4>
                  <p className="text-gray-400 font-medium leading-relaxed">Unsere Techniker werden kontinuierlich bei den Herstellern geschult und zertifiziert.</p>
                </div>
              </div>
            </div>
            <div className="pt-8">
               <a href="/termin" className="inline-flex items-center gap-4 group">
                  <span className="text-lg font-black uppercase tracking-widest text-brand-orange border-b-2 border-brand-orange/20 group-hover:border-brand-orange transition-all duration-300">Direkt Termin anfragen</span>
                  <ChevronRight size={24} className="text-brand-orange group-hover:translate-x-2 transition-transform" />
               </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal & Care Section */}
      <section className="py-32 bg-brand-gray/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="space-y-8">
                <div className="inline-flex px-6 py-2 bg-brand-orange/10 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-orange">
                  Saisonaler Check
                </div>
                <h3 className="text-4xl font-black text-brand-dark uppercase tracking-tight leading-[0.9]">
                  HOLA <br /><span className="text-brand-orange">FRÜHLING!</span>
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed text-lg">
                  Machen Sie Ihr Fahrzeug fit für die warme Jahreszeit. Unser Frühlings-Check prüft 
                  alle relevanten Sicherheitssysteme und Flüssigkeiten zum attraktiven Festpreis.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-brand-dark font-bold">
                    <CheckCircle2 size={20} className="text-brand-orange" />
                    Batterie- und Lichttest
                  </div>
                  <div className="flex items-center gap-4 text-brand-dark font-bold">
                    <CheckCircle2 size={20} className="text-brand-orange" />
                    Bremsen- und Profilprüfung
                  </div>
                </div>
              </div>
              <div className="pt-12">
                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark border-b-2 border-brand-dark/20 hover:border-brand-orange hover:text-brand-orange transition-all py-2">
                  Jetzt anfragen
                </button>
              </div>
            </div>

            <div className="bg-brand-dark p-12 md:p-20 rounded-[4rem] text-white flex flex-col justify-between shadow-2xl shadow-brand-dark/20">
              <div className="space-y-8">
                 <div className="inline-flex px-6 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60">
                  Service Flatrates
                </div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tight leading-[0.9]">
                  SEAT <br /><span className="text-brand-orange">CARE.</span>
                </h3>
                <p className="text-gray-400 font-medium leading-relaxed text-lg">
                  Sorgenfrei fahren mit vollem Kostenschutz. Entdecken Sie unsere maßgeschneiderten 
                  Wartungspakete für Neu- und Gebrauchtwagen zum monatlichen Festpreis.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="text-2xl font-black text-brand-orange mb-2">0 €</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Zusatzkosten*</div>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="text-2xl font-black text-white mb-2">100%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Planbarkeit</div>
                  </div>
                </div>
              </div>
              <div className="pt-12">
                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-white border-b-2 border-white/20 hover:border-brand-orange hover:text-brand-orange transition-all py-2">
                  Mehr erfahren
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tight">Persönliche Beratung</h2>
             <div className="flex flex-wrap justify-center gap-12">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-16 h-16 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                  <Phone size={24} />
                </div>
                <div className="text-left">
                  <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Service Hotline</div>
                  <div className="text-lg font-black text-brand-dark">06041-82338-0</div>
                </div>
              </div>
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-16 h-16 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                  <MessageSquare size={24} />
                </div>
                <div className="text-left">
                  <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">E-Mail Kontakt</div>
                  <div className="text-lg font-black text-brand-dark">service@auto-wiegand.de</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
