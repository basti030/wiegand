"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';

export const CookieConsentTrigger: React.FC = () => {
  return (
    <button 
      onClick={() => window.dispatchEvent(new CustomEvent('reopen-cookie-banner'))}
      className="text-gray-400 hover:text-brand-orange transition-all flex items-center gap-3 text-sm group text-left w-full"
    >
      <ChevronRight size={14} className="text-gray-600 group-hover:text-brand-orange transition-colors" />
      Cookie-Einstellungen
    </button>
  );
};
