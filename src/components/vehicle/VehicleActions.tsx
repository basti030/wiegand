'use client';

import React, { useState, useEffect } from 'react';

interface VehicleActionsProps {
  externalId: string;
}

export default function VehicleActions({ externalId }: VehicleActionsProps) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("wiegand_favs");
    if (stored) {
      try {
        const favs = JSON.parse(stored);
        if (Array.isArray(favs)) {
          setIsFav(favs.includes(externalId));
        }
      } catch (e) {}
    }
  }, [externalId]);

  const toggleFavorite = () => {
    const stored = localStorage.getItem("wiegand_favs");
    let favs: string[] = [];
    if (stored) {
      try {
        favs = JSON.parse(stored);
        if (!Array.isArray(favs)) favs = [];
      } catch (e) {}
    }

    if (favs.includes(externalId)) {
      favs = favs.filter(id => id !== externalId);
      setIsFav(false);
    } else {
      favs.push(externalId);
      setIsFav(true);
    }

    localStorage.setItem("wiegand_favs", JSON.stringify(favs));
    window.dispatchEvent(new Event("favorites-updated"));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link in die Zwischenablage kopiert!");
    }
  };

  return (
    <div className="flex justify-end gap-3 mb-6">
      {/* Share Button */}
      <button 
        onClick={handleShare} 
        className="w-12 h-12 flex items-center justify-center border border-[#009FE3] text-[#009FE3] hover:bg-[#009FE3]/5 rounded-full transition-colors shadow-sm"
        title="Teilen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Zm0-12.814a2.25 2.25 0 1 0 3.933 2.185 2.25 2.25 0 0 0-3.933-2.185Z" />
        </svg>
      </button>

      {/* Heart (Favorite) Button */}
      <button 
        onClick={toggleFavorite} 
        className={`w-12 h-12 flex items-center justify-center border border-[#009FE3] rounded-full transition-colors shadow-sm ${
          isFav ? 'bg-[#009FE3] text-white' : 'text-[#009FE3] hover:bg-[#009FE3]/5 bg-white'
        }`}
        title={isFav ? "Von Merkliste entfernen" : "Auf Merkliste setzen"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>
    </div>
  );
}
