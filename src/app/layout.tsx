import type { Metadata } from "next";
import "./globals.css";
import { Phone, Mail, Clock, MapPin, ChevronRight, Facebook, Instagram } from "lucide-react";
import Link from "next/link";

import { Header } from "../components/Header";
import { CookieConsent } from "../components/CookieConsent";
import { CookieConsentTrigger } from "../components/CookieConsentTrigger";
import { AccessibilityTool } from "../components/AccessibilityTool";

export const metadata: Metadata = {
  title: "Autohaus Wiegand | Premium SEAT, CUPRA & SKODA in Büdingen & Gelnhausen",
  description: "Erleben Sie die Mobilität der Zukunft. Entdecken Sie exklusive Neu- und Gebrauchtwagen sowie erstklassigen Werkstatt-Service.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className="antialiased font-sans text-gray-800 bg-[#F2F2F2]">
        <AccessibilityTool />
        
        <Header />
        
        <main className="min-h-screen">{children}</main>
        
        <CookieConsent />

        {/* Classic Functional Footer */}
        <footer className="bg-[#222222] text-gray-400 pt-16 pb-8 border-t-4 border-brand-orange">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              
              <div>
                <img src="/images/logo.png" alt="Wiegand" className="h-10 mb-6 bg-white p-2 rounded" />
                <p className="text-sm mb-4">
                  Ihr verlässlicher Partner für SEAT, CUPRA und SKODA im Main-Kinzig-Kreis. Verkauf, Service und Reparatur aus einer Hand.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors"><Facebook size={16} /></a>
                  <a href="#" className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors"><Instagram size={16} /></a>
                </div>
              </div>

              <div>
                <h4 className="text-white text-lg font-bold mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-brand-orange">Fahrzeuge</h4>
                <ul className="space-y-3">
                  <li><Link href="/fahrzeuge" className="flex items-center gap-2 hover:text-white transition-colors"><ChevronRight size={14} className="text-brand-orange" /> Fahrzeugsuche</Link></li>
                  <li><Link href="/fahrzeuge?condition=NEW" className="flex items-center gap-2 hover:text-white transition-colors"><ChevronRight size={14} className="text-brand-orange" /> Neuwagen</Link></li>
                  <li><Link href="/fahrzeuge?condition=USED" className="flex items-center gap-2 hover:text-white transition-colors"><ChevronRight size={14} className="text-brand-orange" /> Gebrauchtwagen</Link></li>
                  <li><Link href="/angebote" className="flex items-center gap-2 hover:text-white transition-colors"><ChevronRight size={14} className="text-brand-orange" /> Aktionsangebote</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white text-lg font-bold mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-brand-orange">Service & Kontakt</h4>
                <ul className="space-y-3">
                  <li><Link href="/service" className="flex items-center gap-2 hover:text-white transition-colors"><ChevronRight size={14} className="text-brand-orange" /> Werkstattleistungen</Link></li>
                  <li><Link href="/termin" className="flex items-center gap-2 hover:text-white transition-colors"><ChevronRight size={14} className="text-brand-orange" /> Online-Terminbuchung</Link></li>
                  <li><Link href="/standorte" className="flex items-center gap-2 hover:text-white transition-colors"><ChevronRight size={14} className="text-brand-orange" /> Standorte & Öffnungszeiten</Link></li>
                  <li><Link href="/karriere" className="flex items-center gap-2 hover:text-white transition-colors"><ChevronRight size={14} className="text-brand-orange" /> Karriere bei Wiegand</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white text-lg font-bold mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-brand-orange">Standorte</h4>
                <div className="mb-4">
                  <div className="text-white font-bold text-sm">Autohaus Wiegand Büdingen</div>
                  <div className="text-sm mt-1">Orleshäuser Str. 21, 63654 Büdingen</div>
                  <a href="tel:06041823380" className="text-brand-orange text-sm font-bold mt-1 block">Tel: 06041 / 82338-0</a>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Autohaus Wiegand Gelnhausen</div>
                  <div className="text-sm mt-1">Lützelhäuser Weg 14, 63571 Gelnhausen</div>
                  <a href="tel:0605192910" className="text-brand-orange text-sm font-bold mt-1 block">Tel: 06051 / 92910</a>
                </div>
              </div>

            </div>

            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
              <p>&copy; {new Date().getFullYear()} Autohaus Wiegand GmbH. Alle Rechte vorbehalten.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
                <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
                <span className="cursor-pointer hover:text-white transition-colors"><CookieConsentTrigger /></span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

