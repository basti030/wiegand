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
      <div className="rounded-none overflow-hidden border border-gray-200 bg-[#f5f5f5] relative group">
        <div className="aspect-[3/2] md:aspect-[16/10] relative">
          <img 
            key={images[activeIndex]}
            src={images[activeIndex] && images[activeIndex] !== "" ? images[activeIndex] : '/images/betrieb.jpg'} 
            alt={`${title} - Ansicht ${activeIndex + 1}`} 
            className="w-full h-full object-contain animate-in fade-in zoom-in duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/betrieb.jpg';
            }}
          />
          
          {/* Navigation Arrows */}
          <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={prevImage}
              className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 hover:bg-[#009FE3] hover:text-white transition-all shadow-md"
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextImage}
              className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 hover:bg-[#009FE3] hover:text-white transition-all shadow-md"
              aria-label="Nächstes Bild"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Image Counter Badge */}
          <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/80 backdrop-blur-md text-white rounded text-xs font-bold tracking-wider">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      </div>
      
      {/* Horizontal Thumbnails Row */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {images.map((img, i) => (
          <button 
            key={i} 
            onClick={() => setActiveIndex(i)}
            className={`flex-shrink-0 w-32 aspect-[4/3] rounded-none cursor-pointer transition-all bg-white border-2 ${
              i === activeIndex 
                ? 'border-[#009FE3] scale-100 shadow' 
                : 'border-gray-200 opacity-70 hover:opacity-100'
            }`}
          >
            <img 
              src={img && img !== "" ? img : '/images/betrieb.jpg'} 
              alt={`Thumbnail ${i + 1}`} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/betrieb.jpg';
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
