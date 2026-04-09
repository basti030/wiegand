import { Zap, Target, Star, Shield, GraduationCap, Coins, TrendingUp, Users, ChevronRight, MessageSquare, ExternalLink, Mail, Phone } from "lucide-react";

export default function KarrierePage() {
  const benefits = [
    {
      icon: <Coins size={24} />,
      title: "Attraktive Vergütung",
      description: "Übertarifliches Gehalt (€44.500 - €53.500) sowie Urlaubs- und Weihnachtsgeld."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Performance Boni",
      description: "Leistungsprämien und attraktive Gewinnbeteiligungen für Ihren Einsatz."
    },
    {
      icon: <Star size={24} />,
      title: "Bonus Card",
      description: "Eine exklusive Bonus-Card mit attraktiven Rabatten bei unseren Partnern."
    },
    {
      icon: <Shield size={24} />,
      title: "Sicherheit",
      description: "Ein krisensicherer Arbeitsplatz in einem familiengeführten Traditionsbetrieb."
    },
    {
      icon: <GraduationCap size={24} />,
      title: "Weiterbildung",
      description: "Umfangreiche Schulungs- und Entwicklungsmöglichkeiten bei unseren Marken."
    },
    {
      icon: <Users size={24} />,
      title: "Team Spirit",
      description: "Kollegiales Umfeld in einem modernen, dynamischen Tribe-Team."
    }
  ];

  const jobs = [
    {
      title: "Diagnosetechniker (m/w/d)",
      location: "Gelnhausen",
      highlights: ["Service & Wartung", "Fehlerdiagnose", "Modernste Technik"],
      description: "Sie sind der Experte für komplexe Systeme? Dann übernehmen Sie die Verantwortung für die präzise Fehleranalyse und Instandsetzung unserer Premium-Modelle.",
      requirements: [
        "Abgeschlossene Ausbildung zum Kfz-Mechatroniker",
        "Fundiertes Wissen in aktueller Fahrzeugtechnik",
        "Sicherer Umgang mit Diagnoseinstrumenten",
        "Hohe Serviceorientierung"
      ]
    },
    {
      title: "KFZ-Mechatroniker (m/w/d)",
      location: "Gelnhausen",
      highlights: ["Inspektionen", "Nachrüstungen", "Reparatur"],
      description: "Bringen Sie Ihre Leidenschaft für Technik in unseren Werkstatt-Alltag ein. Von klassischen Reparaturen bis hin zu innovativen Umbauten.",
      requirements: [
        "Abgeschlossene technische Ausbildung",
        "Kenntnisse in aktueller Fahrzeugtechnologie",
        "Selbstständige Arbeitsweise",
        "Teamfähigkeit und Lernbereitschaft"
      ]
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
              <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-orange">Karriere bei Wiegand</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 animate-fade-in leading-[0.9]">
              JOIN THE <br /><span className="text-brand-orange">TRIBE.</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium mb-12 max-w-2xl leading-relaxed">
              Wir suchen keine Angestellten. Wir suchen Teamplayer mit Haltung, Benzin im Blut 
              und der Leidenschaft, die Mobilität von morgen mitzugestalten.
            </p>
            <div className="flex flex-wrap gap-6">
              <a href="#offene-stellen" className="btn-primary px-12 py-6 text-sm font-black uppercase tracking-widest shadow-2xl shadow-brand-orange/20">
                Offene Stellen sehen
              </a>
              <a href="#benefits" className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px] hover:text-brand-orange transition-colors">
                Deine Benefits entdecken <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 aspect-square bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 text-[10rem] font-black text-white/5 uppercase select-none pointer-events-none tracking-tighter">
          CUPRA
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-32 bg-brand-gray/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tight mb-6">Warum Auto Wiegand?</h2>
            <div className="h-1.5 w-24 bg-brand-orange mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-brand-orange/10 hover:-translate-y-2 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-brand-gray flex items-center justify-center text-brand-orange mb-8 group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-inner">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight mb-4">{benefit.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-32 relative overflow-hidden bg-brand-dark">
        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/5 aspect-square lg:aspect-video">
              <img 
                src="https://www.auto-wiegand.de/media/image/header-der-betrieb.jpg" 
                alt="Workshop Environment" 
                className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent opacity-60"></div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 text-white">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
              ACCEPT THE <br /><span className="text-brand-orange">CHALLENGE.</span>
            </h2>
            <p className="text-lg text-gray-400 font-medium mb-10 leading-relaxed max-w-xl">
              Wir arbeiten mit SEAT, CUPRA und SKODA an der Spitze der Automobiltechnik. 
              Wenn Sie bereit sind für Innovation, Geschwindigkeit und Exzellenz, sind Sie bei uns genau richtig.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center">
                  <span className="text-brand-orange font-black">1</span>
                </div>
                <span className="font-bold text-gray-200">Modernste Diagnosewerkzeuge</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center">
                  <span className="text-brand-orange font-black">2</span>
                </div>
                <span className="font-bold text-gray-200">Zukunftsweisende E-Mobilität</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center">
                  <span className="text-brand-orange font-black">3</span>
                </div>
                <span className="font-bold text-gray-200">Professionelles Werkstattumfeld</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="offene-stellen" className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-20">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tight">Offene Stellen</h2>
              <div className="h-1.5 w-24 bg-brand-orange rounded-full"></div>
            </div>
            <div className="hidden md:block text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Standort: Gelnhausen</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {jobs.map((job, idx) => (
              <div key={idx} className="group bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 hover:border-brand-orange shadow-sm hover:shadow-2xl hover:shadow-brand-orange/10 transition-all duration-500">
                <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap gap-3">
                      {job.highlights.map((h, i) => (
                        <span key={i} className="px-4 py-1.5 bg-brand-gray rounded-full text-[10px] font-black uppercase tracking-widest text-brand-dark">
                          {h}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight group-hover:text-brand-orange transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-3xl">
                      {job.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Dein Profil</h4>
                        <ul className="space-y-3">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                              <Target className="text-brand-orange shrink-0" size={14} />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <a 
                      href="https://www.auto-wiegand.de/karriere/" 
                      className="w-full lg:w-auto h-20 md:h-24 px-12 bg-brand-gray hover:bg-brand-orange text-brand-dark hover:text-white rounded-3xl flex items-center justify-center gap-4 transition-all duration-500 group/btn"
                    >
                      <span className="text-sm font-black uppercase tracking-widest">Jetzt Bewerben</span>
                      <ChevronRight className="group-hover/btn:translate-x-2 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form CTA */}
      <section className="bg-brand-gray py-24 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tight">Nichts passendes dabei?</h2>
            <p className="text-lg text-gray-500 font-medium">
              Wir sind immer an Talenten interessiert. Senden Sie uns gerne eine Initiativbewerbung 
              oder rufen Sie uns direkt an.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <a href="mailto:info.gelnhausen@auto-wiegand.de" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-orange shadow-sm group-hover:bg-brand-orange group-hover:text-white transition-all">
                  <Mail size={20} />
                </div>
                <span className="text-brand-dark font-black uppercase tracking-widest text-[10px]">Per E-Mail bewerben</span>
              </a>
              <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
              <a href="tel:+49605192910" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-orange shadow-sm group-hover:bg-brand-orange group-hover:text-white transition-all">
                  <Phone size={20} />
                </div>
                <span className="text-brand-dark font-black uppercase tracking-widest text-[10px]">Telefonische Anfrage</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
