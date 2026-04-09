"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Eye, Lock } from 'lucide-react';

interface PrivacyPlaceholderProps {
  children: React.ReactNode;
  category: 'statistics' | 'marketing';
  title: string;
  description: string;
}

export const PrivacyPlaceholder: React.FC<PrivacyPlaceholderProps> = ({ 
  children, 
  category, 
  title, 
  description 
}) => {
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent');
      if (consent) {
        try {
          const settings = JSON.parse(consent);
          setHasConsent(!!settings[category]);
        } catch (e) {
          setHasConsent(false);
        }
      }
      setIsLoaded(true);
    };

    checkConsent();
    window.addEventListener('cookie-consent-updated', checkConsent as EventListener);
    return () => window.removeEventListener('cookie-consent-updated', checkConsent as EventListener);
  }, [category]);

  const handleAccept = () => {
    const consent = localStorage.getItem('cookie-consent');
    let settings = { essential: true, statistics: false, marketing: false };
    
    if (consent) {
      try {
        settings = JSON.parse(consent);
      } catch (e) {}
    }
    
    settings[category] = true;
    localStorage.setItem('cookie-consent', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: settings }));
  };

  if (!isLoaded) return <div className="w-full h-full bg-brand-gray animate-pulse rounded-[3rem]" />;

  if (hasConsent) {
    return <>{children}</>;
  }

  return (
    <div className="w-full h-full bg-brand-dark/5 backdrop-blur-sm flex flex-center items-center justify-center p-8 text-center relative overflow-hidden rounded-[3rem] border-4 border-white">
      <div className="relative z-10 max-w-sm space-y-6">
        <div className="w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-brand-orange/5">
          <Shield size={32} />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-black uppercase tracking-tight text-brand-dark">{title} blockiert</h3>
          <p className="text-sm text-gray-500 font-bold leading-relaxed px-4">
            {description} Um dieses Element zu sehen, akzeptieren Sie bitte die {category === 'marketing' ? 'Marketing & Maps' : 'Statistik'} Cookies.
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={handleAccept}
            className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-xl shadow-brand-orange/20 flex items-center justify-center gap-2"
          >
            Inhalt laden <Eye size={16} />
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('reopen-cookie-banner'))}
            className="text-gray-400 hover:text-brand-dark transition-colors font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2"
          >
            Einstellungen öffnen
          </button>
        </div>
      </div>
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-dark/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
    </div>
  );
};
