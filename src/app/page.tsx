"use client";

import { useState, useEffect, useMemo } from "react";
import { Heart, Search, Calendar, Gauge, Car, Fuel, Zap, Settings, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [topVehicles, setTopVehicles] = useState<any[]>([]);
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  
  // Search Box State
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const sliderImages = [
    { src: "/images/seat.jpg", title: "Entdecken Sie SEAT bei Wiegand.", subtitle: "Dynamisches Design und pure Fahrfreude." },
    { src: "/images/cupra.jpg", title: "CUPRA: Leidenschaft pur.", subtitle: "Erleben Sie Performance und Innovation auf höchstem Niveau." },
    { src: "/images/skoda.jpg", title: "ŠKODA – Simply Clever.", subtitle: "Viel Platz, moderne Technik und höchste Zuverlässigkeit." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await supabase.from('vehicles').select('id, brand, price, raw_data, external_id, title, image, status, created_at').order('created_at', { ascending: false });
        if (data) {
          setAllVehicles(data);
          setTopVehicles(data.slice(0, 8));
        }
      } catch (err) {
        console.error('Failed to fetch vehicles:', err);
      }
    }
    fetchData();
  }, []);

  // Compute available brands
  const availableBrands = useMemo(() => {
    const brands = allVehicles.map(v => v.brand || v.raw_data?.make).filter(Boolean);
    return Array.from(new Set(brands)).sort();
  }, [allVehicles]);

  // Compute available models based on selected brand
  const availableModels = useMemo(() => {
    let filtered = allVehicles;
    if (selectedBrand) {
      filtered = filtered.filter(v => 
        String(v.brand || "").toLowerCase() === selectedBrand.toLowerCase() || 
        String(v.raw_data?.make || "").toLowerCase() === selectedBrand.toLowerCase()
      );
    }
    const models = filtered.map(v => v.raw_data?.model).filter(Boolean);
    return Array.from(new Set(models)).sort();
  }, [allVehicles, selectedBrand]);

  // Compute live match count
  const liveMatchCount = useMemo(() => {
    let filtered = allVehicles;
    if (selectedBrand) {
      filtered = filtered.filter(v => 
        String(v.brand || "").toLowerCase() === selectedBrand.toLowerCase() || 
        String(v.raw_data?.make || "").toLowerCase() === selectedBrand.toLowerCase()
      );
    }
    if (selectedModel) {
      filtered = filtered.filter(v => String(v.raw_data?.model || "").toLowerCase() === selectedModel.toLowerCase());
    }
    if (selectedPrice) {
      filtered = filtered.filter(v => {
        const p = v.raw_data?.price?.consumerPriceGross || 0;
        return p <= Number(selectedPrice);
      });
    }
    return filtered.length;
  }, [allVehicles, selectedBrand, selectedModel, selectedPrice]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedModel) params.set("model", selectedModel);
    if (selectedPrice) params.set("price", selectedPrice); // Notice: fahrzeuge page handles numbers too
    
    router.push(`/fahrzeuge?${params.toString()}`);
  };

  return (
    <div className="font-sans bg-[#F2F2F2] min-h-screen">
      
      {/* 1. HERO SLIDER & SEARCH BOX */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex flex-col items-center justify-center">
        {/* Background Image Slider */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {sliderImages.map((slide, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={slide.src} alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center backdrop-blur-md transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center backdrop-blur-md transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center mt-[-50px]">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
            {sliderImages[currentSlide].title}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-sm">
            {sliderImages[currentSlide].subtitle}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/angebote" className="bg-brand-orange hover:bg-[#e66a00] text-white font-bold py-4 px-10 rounded-[30px] transition-colors inline-block text-lg shadow-lg">
              Unsere Angebote
            </Link>
          </div>
        </div>

        {/* The Overlapping Search Box */}
        <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2 px-4">
          <div className="container mx-auto max-w-[1200px]">
            <div className="bg-white rounded-[20px] shadow-xl p-8 border border-gray-100 flex flex-col gap-6">
              
              {/* Top Buttons (Fahrzeug-Showroom & Servicetermin) */}
              <div className="flex justify-center gap-4 border-b border-gray-100 pb-6 -mt-2">
                <Link href="/fahrzeuge" className="bg-[#009FE3] hover:bg-[#0086c2] text-white font-bold py-2.5 px-8 rounded-full text-sm flex items-center gap-2 transition-colors">
                  <Car size={16} /> Fahrzeug-Showroom
                </Link>
                <Link href="/termin" className="bg-[#009FE3] hover:bg-[#0086c2] text-white font-bold py-2.5 px-8 rounded-full text-sm flex items-center gap-2 transition-colors">
                  <Settings size={16} /> Servicetermin
                </Link>
              </div>

              {/* Bottom Search Controls */}
              <div className="flex flex-col md:flex-row items-end gap-6 pt-2">
                <div className="flex-1 w-full relative">
                  <label className="text-[10px] uppercase font-bold text-gray-400 absolute -top-4 left-0">Hersteller</label>
                  <select 
                    value={selectedBrand}
                    onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(""); }}
                    className="w-full bg-transparent py-2 border-b border-black text-lg font-bold text-black focus:outline-none focus:border-brand-orange transition-colors cursor-pointer appearance-none"
                  >
                    <option value="">Alle Hersteller</option>
                    {availableBrands.map((brand: any) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full relative">
                  <label className="text-[10px] uppercase font-bold text-gray-400 absolute -top-4 left-0">Modell</label>
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-transparent py-2 border-b border-black text-lg font-bold text-black focus:outline-none focus:border-brand-orange transition-colors cursor-pointer appearance-none"
                    disabled={availableModels.length === 0}
                  >
                    <option value="">Alle Modelle</option>
                    {availableModels.map((model: any) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full relative">
                  <label className="text-[10px] uppercase font-bold text-gray-400 absolute -top-4 left-0">Preis bis</label>
                  <select 
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full bg-transparent py-2 border-b border-black text-lg font-bold text-black focus:outline-none focus:border-brand-orange transition-colors cursor-pointer appearance-none"
                  >
                    <option value="">Beliebig</option>
                    <option value="15000">15.000 €</option>
                    <option value="20000">20.000 €</option>
                    <option value="25000">25.000 €</option>
                    <option value="30000">30.000 €</option>
                    <option value="40000">40.000 €</option>
                    <option value="50000">50.000 €</option>
                  </select>
                </div>

                <button 
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-white border border-black hover:bg-black hover:text-white text-black font-bold py-3 px-8 rounded-[30px] transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
                >
                  <Search size={18} /> {allVehicles.length > 0 ? `${liveMatchCount} Treffer` : "Laden..."}
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Spacing for overlapping search box */}
      <div className="h-24 md:h-32"></div>

      {/* 2. VEHICLE GRID */}
      <section className="py-12 bg-[#F2F2F2]">
        <div className="container mx-auto max-w-[1400px] px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
            Unsere neuesten Angebote
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topVehicles.length > 0 ? topVehicles.map((vehicle) => {
              const brandLogo = `/images/${(vehicle.brand || 'wiegand').toLowerCase()}.svg`;
              
              return (
                <div key={vehicle.id} className="bg-white rounded-[15px] overflow-hidden group flex flex-col relative">
                  
                  {/* Image Area */}
                  <Link href={`/fahrzeuge/${vehicle.external_id}`} className="block relative h-[250px] overflow-hidden bg-gray-100">
                    <img src={vehicle.image || "/images/hero.jpg"} alt={vehicle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    
                    {/* Brand Logo Overlay */}
                    <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-md">
                      <img src={brandLogo} alt={vehicle.brand} className="h-4 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>

                    {/* Heart Icon Overlay */}
                    <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-orange transition-colors">
                      <Heart size={16} />
                    </button>
                  </Link>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <Link href={`/fahrzeuge/${vehicle.external_id}`}>
                        <h3 className="font-bold text-black text-xl leading-tight mb-1 group-hover:text-brand-orange transition-colors">
                          {vehicle.brand} {vehicle.title?.replace(vehicle.brand || '', '').trim()}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 line-clamp-1">{vehicle.raw_data?.modelDescription || 'Attraktives Angebot'}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="text-[28px] font-bold text-black">{vehicle.price}</div>
                      <div className="text-[10px] text-gray-400 mt-1">Bruttopreis inkl. MwSt.</div>
                    </div>
                    
                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[13px] text-gray-600 mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-black" /> 
                        <span className="font-medium">{vehicle.registration_date || 'Neuwagen'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge size={14} className="text-black" /> 
                        <span className="font-medium">{vehicle.mileage || '0 km'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-black" /> 
                        <span className="font-medium">{vehicle.power || '110 kW'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel size={14} className="text-black" /> 
                        <span className="font-medium">{vehicle.fuel_type || 'Benzin'}</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            }) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-orange rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-bold">Fahrzeuge werden geladen...</p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/fahrzeuge" className="bg-white border border-black hover:bg-black hover:text-white text-black font-bold py-3 px-10 rounded-[30px] transition-colors inline-block text-center">
              Alle Fahrzeuge anzeigen
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ADDITIONAL CONTENT (News / Service) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-[1400px] px-4">
          <div className="grid md:grid-cols-2 gap-8">
            
            <div className="relative h-[400px] rounded-[20px] overflow-hidden group">
              <img src="/images/meisterwerkstatt.jpg" alt="Werkstatt" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Werkstatt & Service</h3>
                <p className="text-lg text-gray-200 mb-6">Perfekter Service für Ihren SEAT, CUPRA oder SKODA.</p>
                <Link href="/termin" className="bg-brand-orange hover:bg-[#e66a00] text-white font-bold py-3 px-8 rounded-[30px] transition-colors w-fit flex items-center gap-2">
                  Termin vereinbaren <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="relative h-[400px] rounded-[20px] overflow-hidden group">
              <img src="/images/betrieb.jpg" alt="Über uns" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Karriere bei Wiegand</h3>
                <p className="text-lg text-gray-200 mb-6">Werden Sie Teil unseres starken Teams in Büdingen oder Gelnhausen.</p>
                <Link href="/karriere" className="bg-brand-orange hover:bg-[#e66a00] text-white font-bold py-3 px-8 rounded-[30px] transition-colors w-fit flex items-center gap-2">
                  Stellenangebote ansehen <ArrowRight size={18} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
