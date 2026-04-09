import type { Metadata } from "next";
import "./globals.css";
import { Phone, Mail, Clock, MessageSquare, Facebook, Instagram, MapPin, Printer, ChevronRight } from "lucide-react";

import { Header } from "../components/Header";

export const metadata: Metadata = {
  title: "Autohaus Wiegand | Ihr Partner für SEAT, CUPRA & SKODA in Büdingen & Gelnhausen",
  description: "Entdecken Sie unsere große Auswahl an Neu- und Gebrauchtwagen sowie erstklassigen Werkstatt-Service beim Autohaus Wiegand in Büdingen und Gelnhausen.",
  openGraph: {
    title: "Autohaus Wiegand | Ihr Partner für SEAT, CUPRA & SKODA",
    description: "Premium Neu- und Gebrauchtwagen in Büdingen & Gelnhausen. Entdecken Sie jetzt unsere Angebote!",
    url: "https://www.auto-wiegand.de",
    siteName: "Autohaus Wiegand",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Autohaus Wiegand Showroom",
      },
    ],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autohaus Wiegand | Ihr Partner für SEAT, CUPRA & SKODA",
    description: "Premium Neu- und Gebrauchtwagen in Büdingen & Gelnhausen.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className="antialiased font-sans text-brand-dark bg-white">
        {/* Top Bar */}
        <div className="hidden lg:block bg-brand-dark text-[11px] text-white py-2 font-medium border-b border-white/5">
          <div className="container mx-auto px-4 flex justify-between items-center flex-wrap gap-y-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 border-r border-white/20 pr-6">
                <a href="https://www.facebook.com/AutoWiegand#" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors" title="Facebook"><Facebook size={14} /></a>
                <a href="https://www.instagram.com/autohaus_wiegand/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors" title="Instagram"><Instagram size={14} /></a>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-brand-orange shrink-0" />
                <span className="leading-tight">
                  Mo - Fr: 07.30 - 18.00 Uhr Sa: 09.00 - 13.00 Uhr | Wir passen unsere Öffnungszeiten (Werkstatt & Teiledienst) ab 1.12 an: Mo - Do: 08:00 - 16:45 Uhr Freitag 08:00 - 15:30 Uhr
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="mailto:info@auto-wiegand.de" className="flex items-center gap-2 hover:text-brand-orange transition-colors lowercase">
                <Mail size={12} className="text-brand-orange" />
                info@auto-wiegand.de
              </a>
              <a href="tel:06041823380" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
                <Phone size={12} className="text-brand-orange" />
                06041-82338-0 / 06051-92910
              </a>
            </div>
          </div>
        </div>

        <Header />

        <main>{children}</main>

        {/* WhatsApp Float */}
        <a 
          href="https://wa.me/496041823380" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
          title="WhatsApp Chat"
        >
          <svg 
            viewBox="0 0 24 24" 
            width="28" 
            height="28" 
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03a11.824 11.824 0 001.578 5.925L0 24l6.135-1.61a11.803 11.803 0 005.911 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.8 11.8 0 00-3.48-8.504z"/>
          </svg>
          <span className="absolute right-full mr-4 bg-white text-brand-dark px-4 py-2 rounded-lg text-sm font-bold shadow-xl opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all">Wir beraten Sie per WhatsApp!</span>
        </a>

        {/* DAT Disclaimer Bar */}
        <div className="bg-white border-t border-gray-100 py-8">
          <div className="container mx-auto px-4 text-[10px] leading-relaxed text-gray-500 max-w-7xl font-medium">
            * Weitere Informationen zum offiziellen Kraftstoffverbrauch und zu den offiziellen spezifischen CO2-Emissionen und ggf. zum Stromverbrauch neuer Pkw können dem Leitfaden über den offiziellen Kraftstoffverbrauch, die offiziellen spezifischen CO2-Emissionen und den offiziellen Stromverbrauch neuer Pkw entnommen werden. Dieser ist an allen Verkaufsstellen und bei der Deutschen Automobil Treuhand GmbH unentgeltlich erhältlich, sowie unter <a href="https://www.dat.de" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">www.dat.de</a>.
          </div>
        </div>

        <footer className="bg-brand-dark text-white pt-24 pb-12 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 mb-20">
              {/* Categories */}
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-white">Kategorien</h4>
                <ul className="space-y-4">
                  {[
                    { name: 'Home', href: '/' },
                    { name: 'Fahrzeuge', href: '/fahrzeuge' },
                    { name: 'Standorte', href: '/standorte' },
                    { name: 'Ansprechpartner', href: '/unternehmen' },
                    { name: 'Kontakt', href: '/kontakt' },
                    { name: 'Datenschutz', href: '/datenschutz' },
                    { name: 'Impressum', href: '/impressum' },
                  ].map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-gray-400 hover:text-brand-orange transition-all flex items-center gap-3 text-sm group">
                        <ChevronRight size={14} className="text-gray-600 group-hover:text-brand-orange transition-colors" />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Location: Büdingen */}
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-white flex items-center gap-3">
                  Büdingen
                </h4>
                <div className="space-y-6 text-sm">
                  <div className="flex gap-4 group">
                    <MapPin size={18} className="text-brand-orange shrink-0" />
                    <p className="text-gray-400 leading-relaxed">
                      Autohaus Wiegand GmbH<br />
                      Hauptstraße 1<br />
                      63654 Büdingen
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Phone size={16} className="text-brand-orange shrink-0" />
                    <a href="tel:06041823380" className="text-gray-400 hover:text-white transition-colors">06041/82338-0</a>
                  </div>
                  <div className="flex gap-4">
                    <Printer size={16} className="text-brand-orange shrink-0" />
                    <span className="text-gray-400">06041-6950</span>
                  </div>
                  <div className="flex gap-4">
                    <Mail size={16} className="text-brand-orange shrink-0" />
                    <a href="mailto:info@auto-wiegand.de" className="text-gray-400 hover:text-white transition-colors lowercase">info@auto-wiegand.de</a>
                  </div>
                </div>
              </div>

              {/* Location: Gelnhausen */}
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-white">
                  Gelnhausen
                </h4>
                <div className="space-y-6 text-sm">
                  <div className="flex gap-4 group">
                    <MapPin size={18} className="text-brand-orange shrink-0" />
                    <p className="text-gray-400 leading-relaxed">
                      Autohaus Wiegand Gelnhausen GmbH<br />
                      Lagerhausstraße 19<br />
                      63571 Gelnhausen
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Phone size={16} className="text-brand-orange shrink-0" />
                    <a href="tel:0605192910" className="text-gray-400 hover:text-white transition-colors">06051-92910</a>
                  </div>
                  <div className="flex gap-4">
                    <Printer size={16} className="text-brand-orange shrink-0" />
                    <span className="text-gray-400">06051-929149</span>
                  </div>
                  <div className="flex gap-4">
                    <Mail size={16} className="text-brand-orange shrink-0" />
                    <a href="mailto:info.gelnhausen@auto-wiegand.de" className="text-gray-400 hover:text-white transition-colors lowercase">info.gelnhausen@auto-wiegand.de</a>
                  </div>
                </div>
              </div>

              {/* Newsletter & Social */}
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-white">Newsletter</h4>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                  Bleiben Sie stets informiert und melden Sie sich für unseren Newsletter an:
                </p>
                <div className="flex gap-3 mb-12">
                  <a href="https://www.facebook.com/AutoWiegand#" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 hover:border-brand-orange hover:bg-brand-orange/10 flex items-center justify-center transition-all group" title="Facebook">
                    <Facebook size={18} className="text-gray-400 group-hover:text-brand-orange transition-colors" />
                  </a>
                  <a href="https://www.instagram.com/autohaus_wiegand/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 hover:border-brand-orange hover:bg-brand-orange/10 flex items-center justify-center transition-all group" title="Instagram">
                    <Instagram size={18} className="text-gray-400 group-hover:text-brand-orange transition-colors" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[11px] text-gray-600 font-black uppercase tracking-widest">
                &copy; COPYRIGHT {new Date().getFullYear()}. ALL RIGHTS RESERVED
              </p>
              <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-gray-600">
                <a href="/impressum" className="hover:text-white transition-colors">Impressum</a>
                <a href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
