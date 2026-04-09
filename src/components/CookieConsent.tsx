"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronRight, Check, X, Settings, Info } from 'lucide-react';

interface CookieSettings {
  essential: boolean;
  statistics: boolean;
  marketing: boolean;
}

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true,
    statistics: true,
    marketing: true
  });

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        const savedSettings = JSON.parse(consent);
        setSettings(savedSettings);
        // Trigger event for late-loading scripts
        window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: savedSettings }));
      } catch (e) {
        setShowBanner(true);
      }
    }

    // Listen for manual reopen requests (e.g. from footer)
    const handleReopen = () => {
      setShowBanner(true);
      setShowDetails(true);
    };
    window.addEventListener('reopen-cookie-banner', handleReopen);
    return () => window.removeEventListener('reopen-cookie-banner', handleReopen);
  }, []);

  const saveConsent = (newSettings: CookieSettings) => {
    localStorage.setItem('cookie-consent', JSON.stringify(newSettings));
    setSettings(newSettings);
    setShowBanner(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: newSettings }));
    
    // Refresh page if consent changed significantly to ensure scripts are blocked/loaded
    // In a real SPA we might handle this more gracefully, but for now, simple event is enough.
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, statistics: true, marketing: true });
  };

  const handleAcceptEssential = () => {
    saveConsent({ essential: true, statistics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    saveConsent(settings);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] pointer-events-none flex items-end justify-center p-4 md:p-8">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="w-full max-w-4xl bg-brand-dark/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl pointer-events-auto overflow-hidden text-white"
        >
          <div className="flex flex-col lg:flex-row h-full">
            
            {/* Left/Main Content */}
            <div className="p-8 md:p-12 flex-grow">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-brand-orange text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Privatsphäre-Einstellungen</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Autohaus Wiegand Consent Management</p>
                </div>
              </div>

              {!showDetails ? (
                <div className="space-y-6">
                  <p className="text-sm text-gray-300 leading-relaxed font-bold">
                    Wir nutzen Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Webseite zu bieten. 
                    Einige sind essenziell für den Betrieb der Seite, während andere uns helfen, diese Webseite 
                    und das Nutzererlebnis zu verbessern (Statistiken & Marketing).
                  </p>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                    Sie können Ihre Auswahl jederzeit in unserer <a href="/datenschutz" className="text-brand-orange hover:underline">Datenschutzerklärung</a> anpassen.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                  {/* Essential */}
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                        <Check size={14} className="text-green-500" /> Essentiell
                      </h4>
                      <div className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase text-gray-400">Immer Aktiv</div>
                    </div>
                    <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
                      Diese Cookies werden für die Grundfunktionen der Webseite benötigt. Sie ermöglichen z.B. die Seitennavigation und den Zugriff auf gesicherte Bereiche.
                    </p>
                  </div>

                  {/* Statistics */}
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                        <Info size={14} className="text-brand-orange" /> Statistik
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.statistics} 
                          onChange={(e) => setSettings({...settings, statistics: e.target.checked})}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                      </label>
                    </div>
                    <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
                      Wir nutzen Google Analytics, um anonymisierte Nutzerdaten zu sammeln. Dies hilft uns zu verstehen, wie Besucher mit unserer Seite interagieren.
                    </p>
                  </div>

                  {/* Marketing */}
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                        <Settings size={14} className="text-brand-orange" /> Marketing & Maps
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.marketing}
                          onChange={(e) => setSettings({...settings, marketing: e.target.checked})}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                      </label>
                    </div>
                    <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
                      Ermöglicht das Laden von interaktiven Karten (Google Maps) und personalisierter Werbung.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Sidebar */}
            <div className="bg-white/5 lg:w-[320px] p-8 md:p-12 flex flex-col justify-center gap-4 lg:border-l border-white/10">
              <button 
                onClick={handleAcceptAll}
                className="w-full bg-brand-orange text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-brand-orange/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Alle akzeptieren <Check size={16} />
              </button>
              
              <button 
                onClick={showDetails ? handleSaveCustom : handleAcceptEssential}
                className="w-full bg-white/10 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                {showDetails ? 'Auswahl speichern' : 'Nur Essentielle'}
              </button>

              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full text-gray-400 py-2 font-black uppercase tracking-widest text-[9px] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                {showDetails ? <X size={14} /> : <Settings size={14} />} 
                {showDetails ? 'Schließen' : 'Individuell anpassen'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
