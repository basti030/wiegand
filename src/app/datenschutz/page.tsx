import { Shield, Eye, Lock, FileText, Globe, Server, UserCheck, MessageSquare } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz | Autohaus Wiegand",
  description: "Informationen zum Datenschutz und zum Umgang mit Ihren personenbezogenen Daten bei Autohaus Wiegand.",
};

export default function DatenschutzPage() {
  return (
    <div className="bg-brand-gray min-h-screen pb-24">
      {/* Header */}
      <section className="bg-brand-dark pt-32 pb-20 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-12 h-1 bg-brand-orange"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sicherheit</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">Datenschutz</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm italic">Umgang mit Ihren Daten</p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* General Info */}
          <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-brand-orange text-white rounded-2xl flex items-center justify-center shadow-lg">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">1. Datenschutz auf einen Blick</h2>
            </div>
            <div className="prose prose-sm font-bold text-gray-500 leading-relaxed max-w-none">
              <p>
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich 
                und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung. Die Nutzung unserer Webseite ist in der Regel 
                ohne Angabe personenbezogener Daten möglich.
              </p>
              <p>
                Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. 
                Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
              </p>
            </div>
          </div>

          {/* Controller Info */}
          <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-xl border border-gray-100">
             <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 bg-brand-dark text-white rounded-2xl flex items-center justify-center shadow-lg">
                <UserCheck size={24} />
              </div>
              <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">2. Verantwortliche Stelle</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-brand-orange font-black uppercase text-[10px] tracking-widest mb-4">Verantwortlicher (Büdingen)</h3>
                  <p className="text-sm text-gray-500 font-bold">
                    Autohaus Wiegand GmbH<br />
                    Hauptstraße 1<br />
                    63654 Büdingen<br /><br />
                    Email: info@auto-wiegand.de
                  </p>
               </div>
               <div>
                  <h3 className="text-brand-orange font-black uppercase text-[10px] tracking-widest mb-4">Verantwortlicher (Gelnhausen)</h3>
                  <p className="text-sm text-gray-500 font-bold">
                    Wiegand Gelnhausen GmbH<br />
                    Am Spitalacker 6<br />
                    63571 Gelnhausen<br /><br />
                    Email: info.gelnhausen@auto-wiegand.de
                  </p>
               </div>
            </div>
          </div>

          {/* Data Collection */}
          <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-xl border border-gray-100 space-y-16">
            
            {/* Server Logs */}
            <div className="group">
               <div className="flex items-center gap-4 mb-6">
                <Server size={20} className="text-brand-orange" />
                <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight italic">Server-Log-Dateien</h3>
              </div>
              <p className="text-sm text-gray-500 font-bold leading-relaxed">
                Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, 
                die Ihr Browser automatisch an uns übermittelt. Dies sind: Browser-Typ, Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners 
                und Uhrzeit der Serveranfrage. Diese Daten sind nicht bestimmten Personen zuordbar. Eine Zusammenführung dieser Daten mit anderen 
                Datenquellen wird nicht vorgenommen.
              </p>
            </div>

            {/* Cookies */}
            <div className="group">
               <div className="flex items-center gap-4 mb-6">
                <Lock size={20} className="text-brand-orange" />
                <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight italic">Cookies</h3>
              </div>
              <p className="text-sm text-gray-500 font-bold leading-relaxed">
                Die Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. 
                Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine Textdateien, die auf Ihrem Rechner 
                abgelegt werden und die Ihr Browser speichert. Die meisten der von uns verwendeten Cookies sind so genannte „Session-Cookies“.
              </p>
            </div>

            {/* Google Analytics */}
            <div className="group">
               <div className="flex items-center gap-4 mb-6">
                <Eye size={20} className="text-brand-orange" />
                <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight italic">Google Analytics</h3>
              </div>
              <p className="text-sm text-gray-500 font-bold leading-relaxed">
                Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. Anbieter ist die Google Ireland Limited. 
                Google Analytics verwendet Cookies. Auf dieser Webseite wurde die Funktion IP-Anonymisierung aktiviert. 
                Dadurch wird Ihre IP-Adresse von Google innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen 
                Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum vor der Übermittlung in die USA gekürzt.
              </p>
            </div>

             {/* Google Maps */}
             <div className="group">
               <div className="flex items-center gap-4 mb-6">
                <Globe size={20} className="text-brand-orange" />
                <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight italic">Google Maps</h3>
              </div>
              <p className="text-sm text-gray-500 font-bold leading-relaxed">
                Diese Seite nutzt über eine API den Kartendienst Google Maps. Zur Nutzung der Funktionen von Google Maps ist es notwendig, 
                Ihre IP Adresse zu speichern. Diese Informationen werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. 
                Der Anbieter dieser Seite hat keinen Einfluss auf diese Datenübertragung.
              </p>
            </div>
          </div>

          {/* Rights */}
          <div className="bg-brand-dark rounded-[3rem] p-10 md:p-14 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <FileText className="text-brand-orange" />
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white">Ihre Rechte</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-xs font-bold text-gray-400">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 italic">
                    <span className="text-white uppercase tracking-widest block mb-2 font-black">Auskunftsrecht</span>
                    Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten.
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 italic">
                    <span className="text-white uppercase tracking-widest block mb-2 font-black">Löschungsrecht</span>
                    Sie haben das Recht auf Berichtigung, Sperrung oder Löschung dieser Daten.
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 italic">
                    <span className="text-white uppercase tracking-widest block mb-2 font-black">Widerspruch</span>
                    Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
                  </div>
                </div>
             </div>
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
