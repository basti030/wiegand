import { Phone, Mail, Clock, MapPin, Printer, ChevronRight, MessageSquare, ExternalLink } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsere Standorte | Autohaus Wiegand",
  description: "Besuchen Sie uns in Büdingen oder Gelnhausen. Hier finden Sie Adressen, Öffnungszeiten und Ansprechpartner unserer Autohäuser.",
};

export default function StandortePage() {
  const locations = [
    {
      name: "Büdingen",
      company: "Autohaus Wiegand GmbH",
      address: "Auf dem Biehm 23, 63654 Büdingen",
      phone: "06041-82338-0",
      fax: "06041-6950",
      email: "info@auto-wiegand.de",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2543.123456789!2d9.116812!3d50.292211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDE3JzMyLjAiTiA5wrAwNycyMC41IkU!5e0!3m2!1sde!2sde!4v1620000000000!5m2!1sde!2sde",
      image: "https://www.auto-wiegand.de/media/image/header-der-betrieb.jpg",
      details: {
        sales: {
          mon_fri: "07:30 – 18:00 Uhr",
          sat: "09:00 – 13:00 Uhr"
        },
        service: {
          mon_thu: "08:00 – 16:45 Uhr",
          fri: "08:00 – 15:30 Uhr",
          sat: "Geschlossen"
        }
      }
    },
    {
      name: "Gelnhausen",
      company: "Autohaus Wiegand Gelnhausen GmbH",
      address: "Am Spitalacker 6, 63571 Gelnhausen",
      phone: "06051-92910",
      fax: "06051-929149",
      email: "info.gelnhausen@auto-wiegand.de",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2543.123456789!2d9.184285!3d50.209121!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDEyJzMyLjgiTiA5wrAxMScwMy40IkU!5e0!3m2!1sde!2sde!4v1620000000000!5m2!1sde!2sde",
      image: "https://www.auto-wiegand.de/media/image/header-der-betrieb.jpg",
      details: {
        sales: {
          mon_fri: "07:30 – 18:00 Uhr",
          sat: "09:00 – 13:00 Uhr"
        },
        service: {
          mon_thu: "08:00 – 16:45 Uhr",
          fri: "08:00 – 15:30 Uhr",
          sat: "Geschlossen"
        }
      }
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-dark text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 animate-fade-in text-white">
              Unsere <span className="text-brand-orange">Standorte</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium mb-12 leading-relaxed">
              Besuchen Sie uns in Büdingen oder Gelnhausen. Professioneller Service, 
              modernste Technik und eine exzellente Fahrzeugauswahl erwarten Sie an unseren beiden Standorten.
            </p>
          </div>
        </div>
        {/* Abstract Background Design */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-orange/10 to-transparent blur-3xl pointer-events-none"></div>
      </section>

      {/* Locations Display */}
      <section className="py-24 space-y-32">
        {locations.map((loc, idx) => (
          <div key={idx} className="container mx-auto px-4">
            <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-start`}>
              {/* Info Column */}
              <div className="w-full lg:w-1/2 space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="h-0.5 w-12 bg-brand-orange"></span>
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-brand-orange">Standort</span>
                  </div>
                  <h2 className="text-5xl font-black text-brand-dark tracking-tighter uppercase">{loc.name}</h2>
                  <p className="text-lg text-gray-500 font-medium">{loc.company}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark">Kontakt & Adresse</h4>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <MapPin className="text-brand-orange shrink-0" size={20} />
                        <span className="text-gray-600 font-bold leading-relaxed">{loc.address}</span>
                      </div>
                      <a href={`tel:${loc.phone}`} className="flex items-center gap-4 group">
                        <Phone className="text-brand-orange shrink-0" size={18} />
                        <span className="text-gray-600 font-bold group-hover:text-brand-orange transition-colors">{loc.phone}</span>
                      </a>
                      <div className="flex items-center gap-4">
                        <Printer className="text-brand-orange shrink-0" size={18} />
                        <span className="text-gray-600 font-bold">{loc.fax}</span>
                      </div>
                      <a href={`mailto:${loc.email}`} className="flex items-center gap-4 group">
                        <Mail className="text-brand-orange shrink-0" size={18} />
                        <span className="text-gray-600 font-bold group-hover:text-brand-orange transition-colors truncate">{loc.email}</span>
                      </a>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark">Zeiten (Ab 01.12.)</h4>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-brand-orange uppercase">Verkauf</div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium">Mo - Fr:</span>
                          <span className="text-brand-dark font-bold">{loc.details.sales.mon_fri}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium">Samstag:</span>
                          <span className="text-brand-dark font-bold">{loc.details.sales.sat}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-brand-orange uppercase">Service / Teile</div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium">Mo - Do:</span>
                          <span className="text-brand-dark font-bold">{loc.details.service.mon_thu}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium">Freitag:</span>
                          <span className="text-brand-dark font-bold">{loc.details.service.fri}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium">Samstag:</span>
                          <span className="text-brand-dark font-bold">{loc.details.service.sat}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex flex-wrap gap-4">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 text-sm font-black px-10 py-5 shadow-xl shadow-brand-orange/20">
                    Route planen <ExternalLink size={16} />
                  </a>
                  <a href="/service" className="inline-flex items-center justify-center px-10 py-5 border-2 border-brand-dark text-brand-dark rounded-2xl font-black text-sm hover:bg-brand-dark hover:text-white transition-all uppercase tracking-widest">
                    Termin anfragen
                  </a>
                </div>
              </div>

              {/* Map/Image Column */}
              <div className="w-full lg:w-1/2 group">
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-brand-gray border-4 border-white aspect-video lg:aspect-square">
                  {/* Google Map Embed */}
                  <iframe
                    src={loc.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title={`Standort ${loc.name}`}
                    className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-1000"
                  ></iframe>
                  
                  {/* Glassmorphism Badge */}
                  <div className="absolute top-8 left-8 p-6 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl max-w-xs">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Besuchen Sie uns</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      Wir freuen uns auf Ihren Besuch in {loc.name}. Parkplätze finden Sie direkt auf unserem Gelände.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Brands Section */}
      <section className="bg-brand-gray py-24 border-y border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h4 className="text-sm font-black uppercase tracking-[0.4em] text-brand-orange mb-12">Unsere Marken an beiden Standorten</h4>
          <div className="flex justify-center items-center gap-12 md:gap-24 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            <img src="/images/seat.svg?v=1" alt="SEAT" className="h-8 md:h-12 w-auto object-contain" />
            <img src="/images/cupra.svg?v=1" alt="CUPRA" className="h-8 md:h-12 w-auto object-contain" />
            <img src="/images/skoda.svg?v=1" alt="SKODA" className="h-8 md:h-12 w-auto object-contain" />
          </div>
        </div>
      </section>

      {/* Career Teaser */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-brand-dark rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8">
                Werden Sie Teil unseres <span className="text-brand-orange">Teams</span>
              </h2>
              <p className="text-lg text-gray-400 font-medium mb-12 leading-relaxed">
                An beiden Standorten sind wir stets auf der Suche nach motivierten Talenten. Entdecken Sie jetzt unsere aktuellen Stellenangebote.
              </p>
              <a href="/karriere" className="btn-primary inline-flex text-sm font-black uppercase tracking-widest px-12 py-5 shadow-2xl shadow-brand-orange/20">
                Zu den Stellenanzeigen
              </a>
            </div>
            {/* Abstract glow */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-orange rounded-full blur-[100px] opacity-20"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
