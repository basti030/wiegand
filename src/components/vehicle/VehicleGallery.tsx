'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface VehicleGalleryProps {
  images: string[];
  title: string;
  brand?: string;
}

export default function VehicleGallery({ images, title, brand }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-6">
      {/* Main Image Container */}
      <div className="rounded-[3.5rem] overflow-hidden shadow-2xl shadow-gray-200 bg-white relative group">
        <div className="aspect-[3/2] md:aspect-[16/10] relative bg-gray-100">
          <img 
            key={images[activeIndex]}
            src={images[activeIndex] || '/images/skoda-ocatvia.jpg'} 
            alt={`${title} - Ansicht ${activeIndex + 1}`} 
            className="w-full h-full object-cover animate-in fade-in zoom-in duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/skoda-ocatvia.jpg';
            }}
          />
          
          {/* Navigation Arrows */}
          <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={prevImage}
              className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-dark hover:bg-brand-orange hover:text-white transition-all shadow-xl"
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={nextImage}
              className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-dark hover:bg-brand-orange hover:text-white transition-all shadow-xl"
              aria-label="Nächstes Bild"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Branding Layer Overlay (Main Brands Only) */}
          {brand && ["SEAT", "CUPRA", "SKODA"].includes(brand.toUpperCase()) && (
            <div className="absolute top-8 right-8 w-24 h-24 bg-white/90 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center p-6 shadow-2xl border border-white/50 z-20">
              <img 
                src={`/images/${brand.toLowerCase()}.svg`} 
                alt={brand} 
                className="w-full h-full object-contain brightness-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).classList.add('hidden');
                }}
              />
            </div>
          )}

          {/* Image Counter Badge */}
          <div className="absolute bottom-8 left-8 px-6 py-3 bg-brand-dark/80 backdrop-blur-md text-white rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      </div>
      
      {/* Horizontal Thumbnails Row */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
        {images.map((img, i) => (
          <button 
            key={i} 
            onClick={() => setActiveIndex(i)}
            className={`flex-shrink-0 w-36 aspect-[4/3] rounded-[1.5rem] overflow-hidden cursor-pointer transition-all bg-white shadow-sm border-4 ${
              i === activeIndex 
                ? 'border-brand-orange scale-105 shadow-lg shadow-brand-orange/20' 
                : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'
            }`}
          >
            <img 
              src={img || '/images/skoda-ocatvia.jpg'} 
              alt={`Thumbnail ${i + 1}`} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/skoda-ocatvia.jpg';
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
