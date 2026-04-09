import { MapPin, Phone, Mail, Globe, ShieldCheck, Scale, Info } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | Autohaus Wiegand",
  description: "Gesetzliche Anbieterkennung und rechtliche Hinweise zum Autohaus Wiegand in Büdingen und Gelnhausen.",
};

export default function ImpressumPage() {
  return (
    <div className="bg-brand-gray min-h-screen pb-24">
      {/* Hero Header */}
      <section className="bg-brand-dark pt-32 pb-20 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-12 h-1 bg-brand-orange"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Rechtliches</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">Impressum</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm italic">Gesetzliche Anbieterkennung</p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Section: Büdingen */}
          <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-brand-orange text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Standort Büdingen</h2>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Autohaus Wiegand GmbH</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-black text-brand-dark italic mb-1">Anschrift:</p>
                  <p className="text-sm text-gray-500 font-bold leading-relaxed">
                    Hauptstraße 1<br />
                    63654 Büdingen
                  </p>
                </div>

                <div>
                  <p className="text-sm font-black text-brand-dark italic mb-1">Vertreten durch:</p>
                  <p className="text-sm text-gray-500 font-bold">Raphael Wiegand (Geschäftsführer)</p>
                </div>

                <div className="pt-6 border-t border-gray-50 space-y-4">
                  <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                    <Phone size={16} className="text-brand-orange" />
                    <span>06041-82338-0</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                    <Mail size={16} className="text-brand-orange" />
                    <span className="lowercase">info@auto-wiegand.de</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-50 bg-brand-gray/30 -mx-10 -mb-10 p-10 rounded-b-[2.5rem] space-y-3">
               <div className="flex justify-between text-[11px] font-black uppercase text-gray-400">
                 <span>Registergericht:</span>
                 <span className="text-brand-dark">Amtsgericht Friedberg</span>
               </div>
               <div className="flex justify-between text-[11px] font-black uppercase text-gray-400">
                 <span>Registernummer:</span>
                 <span className="text-brand-dark">HRB 3329</span>
               </div>
               <div className="flex justify-between text-[11px] font-black uppercase text-gray-400">
                 <span>USt-IdNr.:</span>
                 <span className="text-brand-dark">DE112638596</span>
               </div>
            </div>
          </div>

          {/* Section: Gelnhausen */}
          <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-brand-dark text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Standort Gelnhausen</h2>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Wiegand Gelnhausen GmbH</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-black text-brand-dark italic mb-1">Anschrift:</p>
                  <p className="text-sm text-gray-500 font-bold leading-relaxed">
                    Lagerhausstraße 19<br />
                    63571 Gelnhausen
                  </p>
                </div>

                <div>
                  <p className="text-sm font-black text-brand-dark italic mb-1">Vertreten durch:</p>
                  <p className="text-sm text-gray-500 font-bold">Raphael Wiegand (Geschäftsführer)</p>
                </div>

                <div className="pt-6 border-t border-gray-50 space-y-4">
                  <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                    <Phone size={16} className="text-brand-orange" />
                    <span>06051-92910</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                    <Mail size={16} className="text-brand-orange" />
                    <span className="lowercase">info.gelnhausen@auto-wiegand.de</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-50 bg-brand-gray/30 -mx-10 -mb-10 p-10 rounded-b-[2.5rem] space-y-3">
               <div className="flex justify-between text-[11px] font-black uppercase text-gray-400">
                 <span>Registergericht:</span>
                 <span className="text-brand-dark">Amtsgericht Hanau</span>
               </div>
               <div className="flex justify-between text-[11px] font-black uppercase text-gray-400">
                 <span>Registernummer:</span>
                 <span className="text-brand-dark">HRB 97103</span>
               </div>
               <div className="flex justify-between text-[11px] font-black uppercase text-gray-400">
                 <span>Steuernummer:</span>
                 <span className="text-brand-dark">019 248 25099</span>
               </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer / OS Platform */}
        <div className="mt-12 max-w-4xl mx-auto space-y-8 bg-white p-10 md:p-14 rounded-[3rem] shadow-lg border border-gray-100">
          <div className="flex items-start gap-6">
            <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center shrink-0">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-brand-dark mb-4 italic">Online-Streitbeilegung</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-bold">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, 
                die Sie unter folgender Adresse finden: <a href="http://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">http://ec.europa.eu/consumers/odr/</a>. 
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 pt-8 border-t border-gray-50">
            <div className="w-10 h-10 bg-gray-100 text-brand-dark rounded-xl flex items-center justify-center shrink-0">
              <Scale size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-brand-dark mb-4 italic">Verbraucherstreitbeilegung</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-bold">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 pt-8 border-t border-gray-50">
             <div className="w-10 h-10 bg-gray-100 text-brand-dark rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-brand-dark mb-4 italic">Haftung für Inhalte</h3>
              <p className="text-[12px] text-gray-400 leading-relaxed font-bold">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. 
                Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen 
                oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung 
                von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
