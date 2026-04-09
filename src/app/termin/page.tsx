import { Calendar, MapPin, Phone, Info, ChevronRight, Settings, ShieldCheck, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termin vereinbaren | Autohaus Wiegand",
  description: "Buchen Sie Ihren nächsten Werkstatt- oder Beratungstermin ganz einfach online beim Autohaus Wiegand in Büdingen oder Gelnhausen.",
};

export default function TerminPage() {
  const centers = [
    {
      name: "Büdingen",
      dealerId: "80878",
      address: "Auf dem Biehm 23, 63654 Büdingen",
      phone: "06041-82338-0",
      bookingUrl: "https://sbo.porscheinformatik.com/dxone/d/routing?country=DEU&dealer=80878",
      brands: ["SEAT", "CUPRA"]
    },
    {
      name: "Gelnhausen",
      dealerId: "81038",
      address: "Am Spitalacker 6, 63571 Gelnhausen",
      phone: "06051-92910",
      bookingUrl: "https://sbo.porscheinformatik.com/dxone/d/routing?country=DEU&dealer=81038",
      brands: ["SEAT", "CUPRA"]
    }
  ];

  const services = [
    {
      icon: <Settings className="text-brand-orange" size={24} />,
      title: "Räder & Reifen",
      items: ["Saisonaler Räderwechsel", "Einlagerung", "Reifen-Check"]
    },
    {
      icon: <ShieldCheck className="text-brand-orange" size={24} />,
      title: "Inspektion & Öl",
      items: ["Service nach Herstellervorgabe", "Ölwechsel", "Bremsflüssigkeit"]
    },
    {
      icon: <Calendar className="text-brand-orange" size={24} />,
      title: "HU / AU",
      items: ["Hauptuntersuchung", "Abgasuntersuchung", "Vorabcheck"]
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-dark text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 animate-fade-in text-white">
              Online <span className="text-brand-orange">Termin</span> vereinbaren
            </h1>
            <p className="text-lg text-gray-400 font-medium mb-0 leading-relaxed">
              Buchen Sie Ihren Servicetermin für SEAT und CUPRA einfach und bequem rund um die Uhr. 
              Wählen Sie Ihren Standort und sichern Sie sich Ihren Wunschtermin.
            </p>
          </div>
        </div>
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 blur-[100px] pointer-events-none"></div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-24">
        {/* Steps info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24 max-w-5xl mx-auto">
          {[
            { step: "01", title: "Standort wählen", desc: "Wählen Sie Büdingen oder Gelnhausen." },
            { step: "02", title: "Service festlegen", desc: "Grund der Wartung oder Reparatur angeben." },
            { step: "03", title: "Termin buchen", desc: "Wunschzeit wählen & Bestätigung erhalten." }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-6 items-start">
              <span className="text-4xl font-black text-brand-orange/20 leading-none">{item.step}</span>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-brand-dark mb-2">{item.title}</h4>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Location Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
          {centers.map((center, idx) => (
            <div key={idx} className="group bg-brand-gray rounded-[3rem] p-12 border border-transparent hover:border-brand-orange/20 hover:bg-white hover:shadow-2xl hover:shadow-brand-orange/10 transition-all duration-500">
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black text-brand-dark uppercase tracking-tighter">Standort {center.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-orange">
                      <MapPin size={12} /> {center.address}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {center.brands.map(brand => (
                      <span key={brand} className="px-3 py-1 bg-white rounded-full text-[8px] font-black text-brand-dark shadow-sm border border-gray-100">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-200"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Direktkontakt</div>
                    <a href={`tel:${center.phone}`} className="flex items-center gap-3 text-brand-dark hover:text-brand-orange transition-colors font-bold">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                        <Phone size={16} />
                      </div>
                      {center.phone}
                    </a>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</div>
                    <div className="flex items-center gap-3 text-green-600 font-bold">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                        <Clock size={16} />
                      </div>
                      Termine verfügbar
                    </div>
                  </div>
                </div>

                <a 
                  href={center.bookingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full h-24 bg-brand-dark text-white rounded-[2rem] flex items-center justify-center gap-4 group/btn hover:bg-brand-orange transition-all duration-500 shadow-xl shadow-brand-dark/10 hover:shadow-brand-orange/20"
                >
                  <span className="text-sm font-black uppercase tracking-widest">Jetzt Termin buchen</span>
                  <ChevronRight className="group-hover/btn:translate-x-2 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Service Info */}
        <section className="bg-brand-gray/50 rounded-[4rem] p-12 md:p-24 border border-gray-100">
          <div className="text-center mb-20 max-w-2xl mx-auto border-4 border-dashed border-sky-400">
            <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tight mb-4">Häufigste Services</h2>
            <p className="text-sm text-gray-500 font-bold">Wählen Sie Ihren Service direkt im Buchungsportal aus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {services.map((service, idx) => (
              <div key={idx} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    {service.icon}
                  </div>
                  <h4 className="text-lg font-black text-brand-dark uppercase tracking-tight">{service.title}</h4>
                </div>
                <ul className="space-y-3">
                  {service.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-500 font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Support CTA */}
        <div className="mt-24 text-center space-y-8 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-brand-gray flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-sky-300">
            <Info className="text-brand-orange" size={24} />
          </div>
          <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Einen anderen Termin-Wunsch?</h3>
          <p className="text-gray-500 font-medium text-lg leading-relaxed">
            Haben Sie Fragen zu einer Reparatur oder benötigen Sie einen Termin für eine andere Marke? 
            Unser Service-Team ist telefonisch für Sie da.
          </p>
          <div className="pt-4">
            <a href="/standorte" className="inline-flex items-center gap-2 text-brand-orange font-black uppercase tracking-widest text-[10px] hover:translate-x-2 transition-transform">
              Alle Ansprechpartner anzeigen <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
