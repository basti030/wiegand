"use client";

import { useState, useMemo, useEffect } from "react";
import InventoryFilterGrid from "./InventoryFilterGrid";
import { Calendar, Gauge, ArrowRight, ChevronLeft, ChevronRight, ChevronsRight, Leaf } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { formatTechSpecs, getCO2Color } from "@/lib/vehicle-utils";

interface InventoryManagerProps {
  initialVehicles: any[];
  options: any;
}

const ITEMS_PER_PAGE = 40;

export default function InventoryManager({ initialVehicles, options }: InventoryManagerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Helper to find range label for a numeric value
  const getPriceLabel = (val: number) => {
    if (val <= 20000) return "bis 20.000 €";
    if (val <= 30000) return "20.000 - 30.000 €";
    if (val <= 40000) return "30.000 - 40.000 €";
    if (val <= 50000) return "40.000 - 50.000 €";
    return "über 50.000 €";
  };

  const getMileageLabel = (val: number) => {
    if (val <= 5000) return "bis 5.000 km";
    if (val <= 10000) return "bis 10.000 km";
    if (val <= 20000) return "bis 20.000 km";
    if (val <= 50000) return "bis 50.000 km";
    return "über 50.000 km";
  };

  // Initialize filters from URL
  const [filters, setFilters] = useState<any>(() => {
    const params: any = { sort: "newest" };
    searchParams.forEach((value, key) => {
      if (key === 'price' && !isNaN(Number(value))) {
        params.price = getPriceLabel(Number(value));
      } else if (key === 'mileage' && !isNaN(Number(value))) {
        params.mileage = getMileageLabel(Number(value));
      } else {
        params[key] = value;
      }
    });
    return params;
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Sync state back to URL for shareability
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "Alle Hersteller" && value !== "Alle Modelle" && value !== "Beliebig" && value !== "Alle Kraftstoffe" && value !== "Alle Getriebe" && value !== "Alle Typen" && value !== "Alle Farben" && value !== "Alle Zustände") {
        params.set(key, value as string);
      }
    });
    // Optional: Synchronize URL with active state
    // router.replace(`/fahrzeuge${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  }, [filters, router]);

  const resetFilters = () => {
    setFilters({ sort: "newest" });
    setCurrentPage(1);
    router.replace('/fahrzeuge', { scroll: false });
  };

  const filteredVehicles = useMemo(() => {
    let result = [...initialVehicles];

    // Basic filters 
    if (filters.brand && filters.brand !== "Alle Hersteller") {
      result = result.filter(v => 
        v.brand?.toLowerCase() === filters.brand.toLowerCase() || 
        (v.raw_data as any).make?.toLowerCase() === filters.brand.toLowerCase()
      );
    }
    if (filters.model && filters.model !== "Alle Modelle") {
      result = result.filter(v => (v.raw_data as any).model?.toLowerCase() === filters.model.toLowerCase());
    }
    if (filters.fuel && filters.fuel !== "Alle Kraftstoffe") {
      result = result.filter(v => (v.raw_data as any).fuel === filters.fuel);
    }
    if (filters.gearbox && filters.gearbox !== "Alle Getriebe") {
      result = result.filter(v => (v.raw_data as any).gearbox === filters.gearbox);
    }
    if (filters.category && filters.category !== "Alle Typen") {
      result = result.filter(v => (v.raw_data as any).category === filters.category);
    }
    if (filters.color && filters.color !== "Alle Farben") {
      result = result.filter(v => (v.raw_data as any).exteriorColor === filters.color);
    }
    if (filters.condition && filters.condition !== "Alle Zustände") {
      result = result.filter(v => (v.raw_data as any).condition === filters.condition);
    }

    // Price Filter Logic
    if (filters.price && filters.price !== "Beliebig") {
      result = result.filter(v => {
        const p = (v.raw_data as any).price?.consumerPriceGross || 0;
        const filterPrice = filters.price;
        
        if (typeof filterPrice === 'string') {
          if (filterPrice.includes('bis 15.000')) return p <= 15000;
          if (filterPrice.includes('bis 20.000')) return p <= 20000;
          if (filterPrice.includes('bis 25.000')) return p <= 25000;
          if (filterPrice.includes('bis 30.000')) return p <= 30000;
          if (filterPrice.includes('bis 35.000')) return p <= 35000;
          if (filterPrice.includes('bis 40.000')) return p <= 40000;
          if (filterPrice.includes('bis 50.000')) return p <= 50000;
          if (filterPrice.includes('20.000 - 30.000')) return p > 20000 && p <= 30000;
          if (filterPrice.includes('30.000 - 40.000')) return p > 30000 && p <= 40000;
          if (filterPrice.includes('40.000 - 50.000')) return p > 40000 && p <= 50000;
          if (filterPrice === "über 50.000 €") return p > 50000;
        }
        if (!isNaN(Number(filterPrice))) return p <= Number(filterPrice);
        return true;
      });
    }

    // Mileage Filter Logic
    if (filters.mileage && filters.mileage !== "Beliebig") {
      result = result.filter(v => {
        const m = (v.raw_data as any).mileage || 0;
        const fm = filters.mileage;
        if (typeof fm === 'string') {
          if (fm.includes('bis 5.000')) return m <= 5000;
          if (fm.includes('bis 10.000')) return m <= 10000;
          if (fm.includes('bis 20.000')) return m <= 20000;
          if (fm.includes('bis 50.000')) return m <= 50000;
          if (fm.includes('bis 100.000')) return m <= 100000;
          if (fm === "über 50.000 km") return m > 50000;
        }
        if (!isNaN(Number(fm))) return m <= Number(fm);
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sort === "price_asc") {
        return ((a.raw_data as any).price?.consumerPriceGross || 0) - ((b.raw_data as any).price?.consumerPriceGross || 0);
      }
      if (filters.sort === "price_desc") {
        return ((b.raw_data as any).price?.consumerPriceGross || 0) - ((a.raw_data as any).price?.consumerPriceGross || 0);
      }
      if (filters.sort === "mileage_asc") {
        return ((a.raw_data as any).mileage || 0) - ((b.raw_data as any).mileage || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [filters, initialVehicles]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 md:px-10 rounded-[2.5rem] border border-gray-100 shadow-sm gap-6 font-bold text-xs">
        <div className="text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
          <span className="text-brand-dark font-black text-sm">{filteredVehicles.length}</span> 
          <span>Fahrzeuge gefunden</span>
        </div>
        
        <div className="flex items-center gap-3 bg-brand-gray/50 p-2 rounded-2xl">
          <button 
            onClick={() => { setCurrentPage(1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === 1 ? 'text-gray-300 opacity-50' : 'bg-white text-brand-dark hover:bg-brand-orange hover:text-white shadow-sm'}`}
            title="Erste Seite"
          >
            <ChevronLeft size={16} />
            <ChevronLeft size={16} className="-ml-3" />
          </button>
          
          <button 
            onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === 1 ? 'text-gray-300 opacity-50' : 'bg-white text-brand-dark hover:bg-brand-orange hover:text-white shadow-sm'}`}
            title="Vorherige Seite"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="px-6 flex items-center gap-2">
            <span className="text-gray-400 uppercase tracking-widest">Seite</span>
            <span className="w-10 h-10 flex items-center justify-center bg-brand-orange text-white rounded-xl shadow-lg shadow-brand-orange/20">
              {currentPage}
            </span>
            <span className="text-gray-400 uppercase tracking-widest text-[10px]">von {totalPages}</span>
          </div>

          <button 
            onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === totalPages ? 'text-gray-300 opacity-50' : 'bg-white text-brand-dark hover:bg-brand-orange hover:text-white shadow-sm'}`}
            title="Nächste Seite"
          >
            <ChevronRight size={16} />
          </button>

          <button 
            onClick={() => { setCurrentPage(totalPages); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === totalPages ? 'text-gray-300 opacity-50' : 'bg-white text-brand-dark hover:bg-brand-orange hover:text-white shadow-sm'}`}
            title="Letzte Seite"
          >
            <ChevronRight size={16} />
            <ChevronRight size={16} className="-ml-3" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-gray-400 uppercase tracking-widest">
           <span>Pro Seite:</span>
           <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-brand-dark font-black shadow-sm">
             40
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Search Header */}
      <div className="bg-white border rounded-[2rem] px-6 md:px-12 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-brand-dark uppercase tracking-tighter">Fahrzeugbestand</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Exklusives Angebot von Auto Wiegand</p>
        </div>
      </div>

      <InventoryFilterGrid 
        filters={filters} 
        setFilters={setFilters} 
        options={options} 
        onReset={resetFilters}
      />

      {renderPagination()}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {paginatedVehicles.map((v) => {
          const ad = v.raw_data as any;
          const mileage = ad.mileage ? new Intl.NumberFormat('de-DE').format(ad.mileage) : '0';
          const regDate = ad.firstRegistration ? new Date(ad.firstRegistration).getFullYear() : 'NEU';

          const tech = formatTechSpecs(ad);

          return (
            <div key={v.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-brand-orange/20 transition-all overflow-hidden group">
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img src={v.image} alt={v.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-8 left-8 flex flex-col gap-3">
                  <span className="px-5 py-2.5 bg-white/95 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-brand-dark rounded-full shadow-xl">
                    {v.status}
                  </span>
                  {tech.co2Class !== 'k.A.' && (
                    <span className={`px-4 py-1.5 ${getCO2Color(tech.co2Class)} text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg self-start`}>
                      CO2-Klasse {tech.co2Class}
                    </span>
                  )}
                </div>
                {/* Brand Logo Overlay */}
                {["SEAT", "CUPRA", "SKODA"].includes(v.brand?.toUpperCase()) && (
                  <div className="absolute top-6 md:top-10 right-6 md:right-10 w-16 md:w-24 h-16 md:h-24 bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] flex items-center justify-center p-4 md:p-6 shadow-2xl border border-white/50 z-20">
                    <img 
                      src={`/images/${v.brand.toLowerCase()}.svg`} 
                      alt={v.brand} 
                      className="w-full h-full object-contain brightness-0"
                    />
                  </div>
                )}
              </div>

              <div className="p-8 md:p-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-orange">{v.brand}</span>
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-8 line-clamp-1 uppercase tracking-tighter group-hover:text-brand-orange transition-colors">
                  {v.title}
                </h3>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="w-12 h-12 rounded-2xl bg-brand-gray flex items-center justify-center text-brand-dark shadow-sm">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Zulassung</div>
                      <span className="text-xs font-black uppercase tracking-widest">{ad.condition === 'NEW' ? 'Neuwagen' : `EZ ${regDate}`}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="w-12 h-12 rounded-2xl bg-brand-gray flex items-center justify-center text-brand-dark shadow-sm">
                      <Gauge size={20} />
                    </div>
                    <div>
                    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Kilometer</div>
                      <span className="text-xs font-black uppercase tracking-widest">{mileage} km</span>
                    </div>
                  </div>
                </div>

                {/* Tech Specs Summary */}
                <div className="bg-brand-gray/50 rounded-2xl p-5 mb-10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                   <div className="flex items-center gap-3">
                     <Leaf size={14} className="text-green-500" />
                     <span>Kombiniert: {tech.consumption}</span>
                   </div>
                   <div className="h-4 w-px bg-gray-200"></div>
                   <span>{tech.co2}</span>
                </div>

                <div className="flex items-center justify-between pt-10 border-t border-gray-100">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Unser Preis</div>
                    <div className="text-4xl font-black text-brand-dark tracking-tighter">{v.price}</div>
                  </div>
                  <Link 
                    href={`/fahrzeuge/${v.external_id}`} 
                    className="w-16 h-16 bg-brand-dark text-white rounded-[1.5rem] flex items-center justify-center group-hover:bg-brand-orange transition-all shadow-xl shadow-brand-dark/10 hover:-translate-y-1"
                    title={`Details für ${v.title} ansehen`}
                  >
                    <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {renderPagination()}

      {filteredVehicles.length === 0 && (
        <div className="py-40 text-center bg-white rounded-[4rem] border border-dashed border-gray-200 shadow-inner">
           <div className="text-gray-300 font-black uppercase tracking-widest text-sm italic">
             Keine Fahrzeuge entsprechend Ihrer Filterkriterien gefunden
           </div>
           <button onClick={resetFilters} className="mt-8 text-brand-orange font-black uppercase tracking-[0.2em] text-xs hover:text-brand-dark transition-colors">
             Alle Filter zurücksetzen
           </button>
        </div>
      )}
    </div>
  );
}
