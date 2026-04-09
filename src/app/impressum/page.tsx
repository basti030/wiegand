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
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm italic">Gesetzliche Anbieterkennung (1:1)</p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl border border-gray-100 prose prose-sm max-w-none prose-headings:text-brand-dark prose-headings:font-black prose-p:text-gray-500 prose-p:font-bold">
            <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight mb-8">Anbieterinformationen</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 not-prose mb-12">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-orange italic">Standort Büdingen</h3>
                <p className="text-sm font-bold text-gray-700 leading-relaxed">
                  Autohaus Wiegand GmbH<br />
                  Auf dem Biehm 23<br />
                  63654 Büdingen-Düdelsheim<br /><br />
                  Telefon: 06041 - 82338 - 0<br />
                  Telefax: 06041 - 6950<br />
                  E-Mail: info@auto-wiegand.de<br /><br />
                  Geschäftsführer/Inhaber: Raphael Wiegand<br /><br />
                  AG Amstgericht Friedberg / HRB 3329<br />
                  Ust-Ident-Nr.: DE112638596
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-orange italic">Standort Gelnhausen</h3>
                <p className="text-sm font-bold text-gray-700 leading-relaxed">
                  Wiegand Gelnhausen GmbH<br />
                  Am Spitalacker 6<br />
                  63571 Gelnhausen<br /><br />
                  Telefon: 06051-92910<br />
                  Telefax: 06051-929149<br />
                  E-Mail: info.gelnhausen@auto-wiegand.de<br /><br />
                  Geschäftsführer/Inhaber: Raphael Wiegand<br /><br />
                  AG Amstgericht Hanau / HRB 97103<br />
                  Steuernr: 019 248 25099
                </p>
              </div>
            </div>

            <div className="space-y-8 text-gray-500 font-bold text-sm leading-relaxed whitespace-pre-wrap">
              <p>
                Verbraucherinformation gemäß Verordnung EU Nr. 524/2013:
              </p>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit. Die Plattform finden Sie unter http://ec.europa.eu/consumers/odr/ Unsere Email-Adresse lautet: info@auto-wiegand.de
              </p>
              <p>
                Hinweis gemäß § 36 Verbraucherstreitbeilegungsgesetz (VSBG) Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder bereit noch dazu verpflichtet. Wir sind als Versicherungsvermittler gemäß § 34 d Absatz 4 der Gewerbeordnung (gebundener Versicherungsvermittler) über die Volkswagen Versicherungdienst GmbH für die Allianz Versicherung-AG tätig. Wir sind bei der IHK Limburg unter der Vermittlerregister - Nummer D-F2YL-MA2MM-89 registriert.
              </p>
              <p>
                Sollten Sie ausnahmsweise nicht mit unserer Beratungsleistung zufireden sein, können Sie sich auch an folgende Adressen wenden:
              </p>
              <p>
                Versicherungsombudsmann e. V.<br />
                Postfach 080632<br />
                10006 Berlin<br />
                www.versicherungsombudsmann.de
              </p>
              <p>
                Ombudsman für die private Kranken- und Pflegeversicherung<br />
                Postfach 060222; 10052 Berlin<br />
                www.pkv-ombudsman.de
              </p>
              <p>
                Die geminsame Stelle im Sinne des § 11a Abs. 1 der Gewerbeordnung isrt die :<br />
                DIHK e.V.<br />
                Breite Straße 29; 10178 Berlin<br />
                Tel. 0180-5005850 (0,14 EUR/Min. aus dem deutschen Festnetz, höchstens 0,42 EUR/Min. aus Mobilfunknetzen)<br />
                www.vermittlerregister.info
              </p>
              <p className="pt-8 border-t border-gray-100 text-[12px] text-gray-400">
                Alle Rechte vorbehalten. Text, Bilder, Grafiken, Sound, Animationen und Videos unterliegen dem Schutz des Urheberrechts und anderer Schutzgesetze. Der Inhalt dieser Websites darf nicht zu kommerziellen Zwecken kopiert, verbreitet oder Dritten zugänglich gemacht werden. Irrtümer und Änderungen vorbehalten. Sollten wir auf diesen Seiten Verknüpfungen zu anderen Seiten im Internet angelegt haben, so haben wir auf sämtliche Links keinerlei Einfluss. Deshalb distanzieren wir uns hiermit ausdrücklich von allen Inhalten der verknüpften Seiten. Diese Erklärung gilt für alle auf dieser Site ausgebrachten Links und für alle Inhalte der Seiten, zu denen ggf. Banner führen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
