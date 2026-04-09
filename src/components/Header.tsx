"use client";

import React, { useState, useEffect } from "react";
import { MobileMenu } from "./MobileMenu";
import { Menu } from "lucide-react";

const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Fahrzeuge', href: '/fahrzeuge' },
  { name: 'Angebote', href: '/angebote' },
  { name: 'Service', href: '/service' },
  { name: 'Online-Termin', href: '/termin' },
  { name: 'Karriere', href: '/karriere' },
  { name: 'Standorte', href: '/standorte' },
  { name: 'Ansprechpartner', href: '/unternehmen' },
  { name: 'Kontakt', href: '/kontakt' },
];

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 transition-all duration-300 ${
          isScrolled ? "h-16 md:h-20" : "h-20 md:h-28"
        }`}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <a href="/" className="flex items-center shrink-0" aria-label="Autohaus Wiegand Home">
            <img 
              src="/images/logo.png" 
              alt="Autohaus Wiegand - SEAT, CUPRA, SKODA" 
              className={`w-auto object-contain transition-all duration-300 ${
                isScrolled ? "h-8" : "h-10 md:h-12"
              }`}
            />
          </a>
          
          <nav className="hidden xl:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                className="relative text-[11px] uppercase font-black tracking-[0.15em] text-gray-900 hover:text-brand-orange transition-all group py-2"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="xl:hidden p-2 text-brand-dark hover:bg-gray-50 rounded-lg transition-colors" 
            aria-label="Menü öffnen"
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>
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
