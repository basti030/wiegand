import { Mail, Phone, MapPin, Clock, ShieldAlert, ChevronRight, Send, MessageSquare } from "lucide-react";

export default function KontaktPage() {
  const locations = [
    {
      name: "Autohaus Wiegand Büdingen",
      address: "Industriestraße 10, 63654 Büdingen",
      phone: "06041-82338-0",
      fax: "06041-6950",
      email: "info@auto-wiegand.de",
      brands: ["SEAT", "CUPRA"]
    },
    {
      name: "Autohaus Wiegand Gelnhausen",
      address: "Lützelhäuser Weg 6, 63571 Gelnhausen",
      phone: "06051-92910",
      fax: "06051-929149",
      email: "info.gelnhausen@auto-wiegand.de",
      brands: ["SEAT", "CUPRA", "ŠKODA"]
    }
  ];

  const emergencyNumbers = [
    { brand: "SEAT", number: "0800-73282478" },
    { brand: "CUPRA", number: "0800-28772277" },
    { brand: "ŠKODA", number: "0800-4424244" }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-dark text-white py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="h-px w-12 bg-brand-orange"></span>
            <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-orange">Kontakt</span>
            <span className="h-px w-12 bg-brand-orange"></span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
            WIR SIND FÜR <br /><span className="text-brand-orange italic font-black">SIE DA.</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Haben Sie Fragen, Wünsche oder Anregungen? Wählen Sie Ihren Standort 
            oder nutzen Sie unser Kontaktformular. Wir freuen uns auf Sie.
          </p>
        </div>
        {/* Background Decorative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-orange/5 blur-[150px] pointer-events-none rounded-full"></div>
      </section>

      {/* Main Content Split Area */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            
            {/* Left Column: Info & Locations */}
            <div className="space-y-16">
              <div className="space-y-12">
                <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tight">Unsere Standorte</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {locations.map((loc, idx) => (
                    <div key={idx} className="bg-brand-gray/30 p-10 rounded-[3rem] border border-gray-100 hover:border-brand-orange/20 transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 text-brand-orange shadow-sm group-hover:bg-brand-orange group-hover:text-white transition-all">
                        <MapPin size={24} />
                      </div>
                      <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight mb-4">{loc.name}</h3>
                      <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
                        {loc.address}
                      </p>
                      <div className="space-y-3">
                        <a href={`tel:${loc.phone}`} className="flex items-center gap-3 text-brand-dark font-black uppercase tracking-widest text-[10px] hover:text-brand-orange transition-colors">
                          <Phone size={14} className="text-brand-orange" /> {loc.phone}
                        </a>
                        <a href={`mailto:${loc.email}`} className="flex items-center gap-3 text-brand-dark font-black uppercase tracking-widest text-[10px] hover:text-brand-orange transition-colors">
                          <Mail size={14} className="text-brand-orange" /> {loc.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opening Hours */}
              <div className="bg-brand-dark rounded-[3rem] p-12 text-white relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <Clock className="text-brand-orange" size={24} />
                    <h3 className="text-2xl font-black uppercase tracking-tight">Öffnungszeiten</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-4 border-b border-white/10">
                      <span className="text-sm font-black uppercase tracking-widest text-gray-400">Mo – Fr</span>
                      <span className="text-sm font-black uppercase tracking-widest">07:30 – 18:00 Uhr</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-white/10">
                      <span className="text-sm font-black uppercase tracking-widest text-gray-400">Sa</span>
                      <span className="text-sm font-black uppercase tracking-widest">09:00 – 13:00 Uhr</span>
                    </div>
                    <p className="text-[10px] font-medium text-gray-500 pt-4 leading-relaxed">
                      *Werkstatt & Teiledienst bis 16:45 Uhr (Fr 15:30 Uhr). <br />
                      Bitte vereinbaren Sie für Beratungsgespräche vorab einen Termin.
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 blur-[50px] rounded-full"></div>
              </div>

              {/* Help & Support */}
              <div className="space-y-8">
                 <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-4">
                   <ShieldAlert className="text-brand-orange" /> 24h Notfall-Assistenz
                 </h2>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {emergencyNumbers.map((em, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 p-6 rounded-3xl text-center hover:shadow-xl transition-all group">
                         <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-brand-orange mb-2">{em.brand} Hilfe</span>
                         <a href={`tel:${em.number}`} className="text-brand-dark font-black text-xs hover:text-brand-orange transition-colors">
                            {em.number}
                         </a>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="relative">
              <div className="sticky top-32 bg-white rounded-[4rem] p-12 md:p-16 border border-gray-100 shadow-2xl shadow-gray-200/50">
                 <div className="space-y-12">
                    <div className="space-y-4">
                       <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tight">Nachricht senden</h2>
                       <p className="text-gray-500 font-medium">Nutzen Sie unser Formular für eine schnelle Antwort.</p>
                    </div>
                    
                    <form className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 px-4">Ihr Name</label>
                             <input type="text" placeholder="Max Mustermann" className="w-full bg-brand-gray/50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-orange transition-all placeholder:text-gray-300 font-medium" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 px-4">E-Mail Adresse</label>
                             <input type="email" placeholder="max@beispiel.de" className="w-full bg-brand-gray/50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-orange transition-all placeholder:text-gray-300 font-medium" />
                          </div>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 px-4">Betreff</label>
                          <select className="w-full bg-brand-gray/50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-orange transition-all font-medium appearance-none">
                             <option>Allgemeine Anfrage</option>
                             <option>Service-Termin</option>
                             <option>Fahrzeug-Anfrage</option>
                             <option>Tuning / APR Performance</option>
                             <option>Anregung / Kritik</option>
                          </select>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 px-4">Ihre Nachricht</label>
                          <textarea rows={5} placeholder="Wie können wir Ihnen helfen?" className="w-full bg-brand-gray/50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-orange transition-all placeholder:text-gray-300 font-medium resize-none"></textarea>
                       </div>

                       <button className="w-full btn-primary py-6 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-4 group shadow-xl shadow-brand-orange/20">
                          Nachricht absenden <Send size={18} className="group-hover:translate-x-2 transition-transform" />
                       </button>

                       <p className="text-[8px] text-gray-400 text-center uppercase tracking-widest font-medium">
                          Indem Sie fortfahren, akzeptieren Sie unsere <a href="/datenschutz" className="text-brand-orange underline">Datenschutzbestimmungen</a>.
                       </p>
                    </form>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Instant Reach-out (WhatsApp/Phone) */}
      <section className="py-24 bg-brand-gray/30">
         <div className="container mx-auto px-4 text-center space-y-12">
            <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Live-Support & WhatsApp</h3>
            <div className="flex flex-wrap justify-center gap-8">
               <a href="https://wa.me/496041823380" className="flex items-center gap-4 bg-white px-10 py-6 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <svg 
                      viewBox="0 0 24 24" 
                      width="24" 
                      height="24" 
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03a11.824 11.824 0 001.578 5.925L0 24l6.135-1.61a11.803 11.803 0 005.911 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.8 11.8 0 00-3.48-8.504z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                     <span className="block text-[8px] font-black uppercase tracking-widest text-gray-400">Echtzeit Beratung</span>
                     <span className="text-sm font-black uppercase tracking-tight text-brand-dark group-hover:text-brand-orange transition-colors">WhatsApp Chat</span>
                  </div>
               </a>
            </div>
         </div>
      </section>
    </div>
  );
}
