"use client";

import React, { useState, useEffect } from "react";
import { MobileMenu } from "./MobileMenu";
import { Menu, Search, Mail, MapPin, Heart, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { name: 'Startseite', href: '/' },
  { name: 'Fahrzeuge', href: '/fahrzeuge' },
  { name: 'Angebote', href: '/angebote' },
  { name: 'Service', href: '/service' },
  { name: 'Standorte', href: '/standorte' },
  { name: 'Mitarbeiter', href: '/mitarbeiter' },
  { name: 'Karriere', href: '/karriere' },
  { name: 'Über uns', href: '/unternehmen' },
];

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const updateCount = () => {
      const stored = localStorage.getItem("wiegand_favs");
      if (stored) {
        try {
          setFavCount(JSON.parse(stored).length);
        } catch (e) {}
      } else {
        setFavCount(0);
      }
    };

    updateCount();

    window.addEventListener("favorites-updated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("favorites-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const isHome = pathname === '/';

  return (
    <>
      <header className={`w-full z-50 text-white py-4 md:py-5 border-b border-white/10 transition-colors ${isHome ? 'absolute top-0 left-0 bg-gradient-to-b from-black/80 to-transparent' : 'sticky top-0 bg-black'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand Logos (Monochrome) */}
            <div className="hidden lg:flex items-center gap-6 opacity-80">
              <img src="/images/seat.svg" alt="SEAT" className="h-4 filter invert brightness-0" />
              <img src="/images/cupra.svg" alt="CUPRA" className="h-5 filter invert brightness-0" />
              <img src="/images/skoda.svg" alt="SKODA" className="h-4 filter invert brightness-0" />
            </div>

            {/* Center: Main Logo */}
            <div className="flex-1 lg:flex-none flex justify-start lg:justify-center">
              <Link href="/" aria-label="Startseite">
                <img 
                  src="/images/logo.png" 
                  alt="Autohaus Wiegand" 
                  className="h-8 md:h-12 object-contain filter invert brightness-0"
                />
              </Link>
            </div>

            {/* Right: Action Icons */}
            <div className="flex items-center gap-5 md:gap-8">
              <a href="mailto:info@auto-wiegand.de" className="hidden md:flex hover:text-brand-orange transition-colors" aria-label="E-Mail senden">
                <Mail size={22} strokeWidth={1.5} />
              </a>
              <Link href="/standorte" className="hidden sm:flex hover:text-brand-orange transition-colors" aria-label="Standorte">
                <MapPin size={22} strokeWidth={1.5} />
              </Link>
              <Link href="/favoriten" className="relative hover:text-brand-orange transition-colors" aria-label="Favoriten">
                <Heart size={22} strokeWidth={1.5} />
                <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{favCount}</span>
              </Link>
              <a href="tel:06041823380" className="hover:text-brand-orange transition-colors" aria-label="Anrufen">
                <Phone size={22} strokeWidth={1.5} />
              </a>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="hover:text-brand-orange transition-colors ml-2" 
                aria-label="Menü öffnen"
              >
                <Menu size={28} strokeWidth={1.5} />
              </button>
            </div>

          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        items={NAV_ITEMS}
      />
    </>
  );
};




