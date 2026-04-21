'use client';

import React, { useState, useEffect } from 'react';
import { 
  Accessibility, 
  X, 
  Contrast, 
  Type, 
  MousePointer2, 
  Eye, 
  RotateCcw, 
  Heading, 
  Pause,
  ArrowRightLeft,
  Search,
  ImageOff,
  Palette,
  EyeOff,
  Maximize2,
  ListRestart,
  Layout,
  ChevronRight,
  Navigation,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type HeadingItem = {
  id: string;
  text: string;
  level: number;
};

type AccessibilitySettings = {
  // Appearance
  highContrast: boolean;
  grayscale: boolean;
  invert: boolean;
  hideImages: boolean;
  // Content
  largeText: boolean;
  lineHeight: boolean;
  charSpacing: boolean;
  highlightLinks: boolean;
  highlightTitles: boolean;
  legibleFont: boolean;
  pauseAnimations: boolean;
  // Structure
  showStructure: boolean;
  // Navigation
  largeCursor: boolean;
  readingGuide: boolean;
};

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  grayscale: false,
  invert: false,
  hideImages: false,
  largeText: false,
  lineHeight: false,
  charSpacing: false,
  highlightLinks: false,
  highlightTitles: false,
  legibleFont: false,
  pauseAnimations: false,
  showStructure: false,
  largeCursor: false,
  readingGuide: false,
};

export const AccessibilityTool = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [mouseY, setMouseY] = useState(0);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeTab, setActiveTab] = useState<'settings' | 'structure'>('settings');

  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings-v3');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('accessibility-settings-v3', JSON.stringify(settings));
    
    const html = document.documentElement;
    
    // Appearance
    html.classList.toggle('acc-high-contrast', settings.highContrast);
    html.classList.toggle('acc-grayscale', settings.grayscale);
    html.classList.toggle('acc-invert', settings.invert);
    html.classList.toggle('acc-hide-images', settings.hideImages);
    
    // Content
    html.classList.toggle('acc-large-text', settings.largeText);
    html.classList.toggle('acc-line-height', settings.lineHeight);
    html.classList.toggle('acc-char-spacing', settings.charSpacing);
    html.classList.toggle('acc-highlight-links', settings.highlightLinks);
    html.classList.toggle('acc-highlight-titles', settings.highlightTitles);
    html.classList.toggle('acc-legible-font', settings.legibleFont);
    html.classList.toggle('acc-pause-animations', settings.pauseAnimations);
    
    // Structure
    html.classList.toggle('acc-show-structure', settings.showStructure);
    
    // Navigation
    html.classList.toggle('acc-large-cursor', settings.largeCursor);

  }, [settings]);

  // Scan headings for structure tab
  useEffect(() => {
    if (isOpen) {
      const tags = document.querySelectorAll('h1, h2, h3, h4');
      const items: HeadingItem[] = Array.from(tags).map((el, i) => {
        if (!el.id) el.id = `acc-heading-${i}`;
        return {
          id: el.id,
          text: el.textContent || '',
          level: parseInt(el.tagName.replace('H', ''))
        };
      });
      setHeadings(items);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (settings.readingGuide) setMouseY(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.readingGuide]);

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetSettings = () => setSettings(defaultSettings);

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] bg-brand-orange text-white p-4 rounded-r-2xl shadow-[10px_0_30px_rgba(255,123,0,0.3)] hover:pr-6 transition-all flex flex-col items-center gap-2 group border-y border-r border-white/20"
      >
        <Accessibility size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="[writing-mode:vertical-lr] rotate-180 font-black text-[10px] uppercase tracking-[0.2em] mt-2">Barrierefrei</span>
      </button>

      {settings.readingGuide && (
        <div className="acc-reading-guide" style={{ top: mouseY }} />
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md z-[101]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[420px] max-w-[95vw] bg-white z-[102] shadow-[20px_0_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-8 bg-brand-dark text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-brand-orange p-3 rounded-2xl">
                      <Accessibility size={32} />
                    </div>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X size={28} />
                    </button>
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">Barrierefreiheit</h2>
                  
                  {/* Tabs */}
                  <div className="flex gap-4 mt-8">
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`pb-2 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === 'settings' ? 'border-brand-orange text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
                    >
                      Einstellungen
                    </button>
                    <button 
                      onClick={() => setActiveTab('structure')}
                      className={`pb-2 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === 'structure' ? 'border-brand-orange text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
                    >
                      Seiten-Struktur
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab: Settings */}
              <AnimatePresence mode="wait">
                {activeTab === 'settings' ? (
                  <motion.div 
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar"
                  >
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3">
                        <Palette size={14} className="text-brand-orange" /> Darstellung
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <OptionCard icon={<Contrast size={18} />} label="Kontrast" active={settings.highContrast} onClick={() => toggleSetting('highContrast')} />
                        <OptionCard icon={<EyeOff size={18} />} label="Graustufen" active={settings.grayscale} onClick={() => toggleSetting('grayscale')} />
                        <OptionCard icon={<RotateCcw size={18} />} label="Invertieren" active={settings.invert} onClick={() => toggleSetting('invert')} />
                        <OptionCard icon={<ImageOff size={18} />} label="Bilder aus" active={settings.hideImages} onClick={() => toggleSetting('hideImages')} />
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3">
                        <Type size={14} className="text-brand-orange" /> Inhalt
                      </h3>
                      <div className="space-y-3">
                        <OptionRow icon={<Maximize2 size={18} />} label="Großer Text" active={settings.largeText} onClick={() => toggleSetting('largeText')} />
                        <OptionRow icon={<Layout size={18} />} label="Marker an" active={settings.showStructure} onClick={() => toggleSetting('showStructure')} />
                        <OptionRow icon={<Search size={18} />} label="Links hervorheben" active={settings.highlightLinks} onClick={() => toggleSetting('highlightLinks')} />
                        <OptionRow icon={<ListRestart size={18} />} label="Titel hervorheben" active={settings.highlightTitles} onClick={() => toggleSetting('highlightTitles')} />
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3">
                        <Navigation size={14} className="text-brand-orange" /> Navigation
                      </h3>
                      <div className="grid grid-cols-2 gap-3 pb-8">
                        <OptionCard icon={<MousePointer2 size={18} />} label="Cursor" active={settings.largeCursor} onClick={() => toggleSetting('largeCursor')} />
                        <OptionCard icon={<Eye size={18} />} label="Lesehilfe" active={settings.readingGuide} onClick={() => toggleSetting('readingGuide')} />
                      </div>
                    </section>
                  </motion.div>
                ) : (
                  /* Tab: Structure */
                  <motion.div 
                    key="structure"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
                  >
                    <div className="bg-brand-gray p-4 rounded-xl mb-6">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                        Übersicht der Seitenhierarchie. Klicken Sie auf ein Element, um dorthin zu springen.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {headings.length > 0 ? (
                        headings.map((h, i) => (
                          <button
                            key={i}
                            onClick={() => scrollToElement(h.id)}
                            className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-orange hover:bg-brand-orange/5 transition-all text-left group"
                          >
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-brand-orange text-[10px] font-black group-hover:bg-brand-orange group-hover:text-white transition-colors">
                              H{h.level}
                            </span>
                            <span className="flex-1 text-xs font-bold text-gray-700 group-hover:text-brand-dark truncate">
                              {h.text}
                            </span>
                            <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-orange" />
                          </button>
                        ))
                      ) : (
                        <div className="py-20 text-center">
                          <List size={40} className="mx-auto text-gray-200 mb-4" />
                          <p className="text-sm text-gray-400 font-medium">Keine Strukturinformationen gefunden.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="p-8 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-6">
                <button
                  onClick={resetSettings}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-brand-orange transition-colors"
                >
                  <RotateCcw size={14} /> Reset
                </button>
                <div className="flex gap-4">
                  <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Auto Wiegand v2.1</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #eee;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ddd;
        }
      `}</style>
    </>
  );
};

interface OptionProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const OptionCard = ({ icon, label, active, onClick }: OptionProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all group ${
      active 
        ? 'border-brand-orange bg-brand-orange text-white shadow-lg shadow-brand-orange/20' 
        : 'border-gray-100 hover:border-brand-orange/30 text-gray-700 bg-white'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-brand-orange'} transition-colors`}>{icon}</div>
    <span className="font-black text-[10px] uppercase tracking-widest text-center">{label}</span>
  </button>
);

const OptionRow = ({ icon, label, active, onClick }: OptionProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 w-full p-4 rounded-xl border-2 transition-all ${
      active 
        ? 'border-brand-orange bg-brand-orange/5 text-brand-dark' 
        : 'border-gray-100 hover:border-gray-200 text-gray-700 bg-white'
    }`}
  >
    <div className={`p-2 rounded-lg ${active ? 'bg-brand-orange text-white' : 'bg-gray-50 text-brand-orange'}`}>
      {icon}
    </div>
    <span className="font-black text-xs uppercase tracking-[0.15em] flex-1 text-left">{label}</span>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-brand-orange' : 'bg-gray-200'}`}>
      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-6' : 'left-1'}`} />
    </div>
  </button>
);
