"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Facebook, Instagram, Phone, Mail, ChevronRight } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: { name: string; href: string }[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, items }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-[60]"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-brand-dark hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Menü schließen"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-8">
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-gray-900 hover:bg-gray-50 hover:text-brand-orange transition-all group"
                    >
                      {item.name}
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-orange transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Bottom Section */}
            <div className="p-8 bg-gray-50 border-t border-gray-100">
              <div className="space-y-4 mb-8">
                <a href="tel:06041823380" className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-brand-orange transition-colors">
                  <Phone size={18} className="text-brand-orange" />
                  06041-82338-0
                </a>
                <a href="mailto:info@auto-wiegand.de" className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-brand-orange transition-colors">
                  <Mail size={18} className="text-brand-orange" />
                  info@auto-wiegand.de
                </a>
              </div>
              
              <div className="flex gap-4">
                <a href="https://www.facebook.com/AutoWiegand#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-orange hover:border-brand-orange transition-all">
                  <Facebook size={20} />
                </a>
                <a href="https://www.instagram.com/autohaus_wiegand/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-orange hover:border-brand-orange transition-all">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
