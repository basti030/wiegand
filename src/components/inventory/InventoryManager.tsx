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

  // Use local state for filters to ensure immediate and stable updates
  const [filters, setFilters] = useState<any>(() => {
    const params: any = { sort: "newest" };
    try {
      // Initialize once from URL
      if (typeof window !== 'undefined') {
        const search = new URLSearchParams(window.location.search);
        search.forEach((value, key) => {
          if (key === 'price' && !isNaN(Number(value))) {
            params.price = getPriceLabel(Number(value));
          } else if (key === 'mileage' && !isNaN(Number(value))) {
            params.mileage = getMileageLabel(Number(value));
          } else {
            params[key] = value;
          }
        });
      }
    } catch (e) {
      console.error("Error initializing filters:", e);
    }
    return params;
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (key: string, value: any) => {
    try {
      const newFilters = { ...filters };
      const params = new URLSearchParams(window.location.search);
      
      const isResetValue = value === "Alle Hersteller" || 
                           value === "Alle Modelle" || 
                           value === "Beliebig" || 
                           value === "Alle Kraftstoffe" || 
                           value === "Alle Getriebe" || 
                           value === "Alle Typen" || 
                           value === "Alle Farben" || 
                           value === "Alle Zustände" ||
                           value === "Alle Standorte";

      if (isResetValue) {
        params.delete(key);
        delete newFilters[key];
      } else {
        newFilters[key] = value;
        if (key === 'price' && typeof value === 'string' && value.includes('bis ')) {
          params.set(key, value.replace(/[^0-9]/g, ''));
        } else if (key === 'mileage' && typeof value === 'string' && value.includes('bis ')) {
          params.set(key, value.replace(/[^0-9]/g, ''));
        } else {
          params.set(key, value);
        }
      }

      // Update state for immediate UI feedback
      setFilters(newFilters);
      setCurrentPage(1);

      // Update URL without triggering a full Next.js navigation crash
      const queryString = params.toString();
      const newUrl = queryString ? `/fahrzeuge?${queryString}` : '/fahrzeuge';
      window.history.replaceState(null, '', newUrl);
    } catch (e) {
      console.error("handleFilterChange error:", e);
    }
  };

  const resetFilters = () => {
    setFilters({ sort: "newest" });
    setCurrentPage(1);
    window.history.replaceState(null, '', '/fahrzeuge');
  };

  const filteredVehicles = useMemo(() => {
    try {
      let result = [...initialVehicles];

      // Basic filters 
      if (filters.brand && filters.brand !== "Alle Hersteller") {
        result = result.filter(v => 
          String(v.brand || "").toLowerCase() === String(filters.brand).toLowerCase() || 
          String((v.raw_data as any)?.make || "").toLowerCase() === String(filters.brand).toLowerCase()
        );
      }
      if (filters.model && filters.model !== "Alle Modelle") {
        result = result.filter(v => String((v.raw_data as any)?.model || "").toLowerCase() === String(filters.model).toLowerCase());
      }
      if (filters.fuel && filters.fuel !== "Alle Kraftstoffe") {
        result = result.filter(v => (v.raw_data as any)?.fuel === filters.fuel);
      }
      if (filters.gearbox && filters.gearbox !== "Alle Getriebe") {
        result = result.filter(v => (v.raw_data as any)?.gearbox === filters.gearbox);
      }
      if (filters.category && filters.category !== "Alle Typen") {
        result = result.filter(v => (v.raw_data as any)?.category === filters.category);
      }
      if (filters.color && filters.color !== "Alle Farben") {
        result = result.filter(v => (v.raw_data as any)?.exteriorColor === filters.color);
      }
      if (filters.condition && filters.condition !== "Alle Zustände") {
        result = result.filter(v => (v.raw_data as any)?.condition === filters.condition);
      }
      if (filters.location && filters.location !== "Alle Standorte") {
        result = result.filter(v => String((v.raw_data as any)?.location || "").toLowerCase().includes(String(filters.location).toLowerCase()));
      }

      // Price Filter Logic
      if (filters.price && filters.price !== "Beliebig") {
        result = result.filter(v => {
          const p = (v.raw_data as any)?.price?.consumerPriceGross || 0;
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
          const m = (v.raw_data as any)?.mileage || 0;
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
        try {
          if (filters.sort === "price_asc") {
            return ((a.raw_data as any)?.price?.consumerPriceGross || 0) - ((b.raw_data as any)?.price?.consumerPriceGross || 0);
          }
          if (filters.sort === "price_desc") {
            return ((b.raw_data as any)?.price?.consumerPriceGross || 0) - ((a.raw_data as any)?.price?.consumerPriceGross || 0);
          }
          if (filters.sort === "mileage_asc") {
            return ((a.raw_data as any)?.mileage || 0) - ((b.raw_data as any)?.mileage || 0);
          }
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
        } catch (e) {
          return 0;
        }
      });

      return result;
    } catch (e) {
      console.error("Error in filteredVehicles useMemo:", e);
      return [];
    }
  }, [filters, initialVehicles]);

  // DYNAMIC OPTIONS: Faceted Search logic
  // Options for a filter X are calculated by applying all filters EXCEPT filter X.
  // This fulfills the user request: "wenn die Option nicht mehr vorhanden ist diese gar nicht zur Auswahl steht"
  const dynamicOptions = useMemo(() => {
    const extract = (key: string, data: any[]) => {
      if (!Array.isArray(data)) return [];
      return Array.from(new Set(data.filter(v => !!v).map(v => (v.raw_data as any)?.[key] || v[key]).filter(Boolean))).sort() as string[];
    };

    const applyFilters = (vehicles: any[], currentFilters: any, excludeKey?: string) => {
      let result = [...vehicles];
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (key === excludeKey || key === 'sort') return;
        if (!value || value === "Alle Hersteller" || value === "Alle Modelle" || value === "Beliebig" || value === "Alle Kraftstoffe" || value === "Alle Getriebe" || value === "Alle Typen" || value === "Alle Farben" || value === "Alle Zustände" || value === "Alle Standorte") return;

        if (key === 'brand') {
          result = result.filter(v => String(v.brand || "").toLowerCase() === String(value).toLowerCase() || String((v.raw_data as any)?.make || "").toLowerCase() === String(value).toLowerCase());
        } else if (key === 'model') {
          result = result.filter(v => String((v.raw_data as any)?.model || "").toLowerCase() === String(value).toLowerCase());
        } else if (key === 'fuel') {
          result = result.filter(v => (v.raw_data as any)?.fuel === value);
        } else if (key === 'gearbox') {
          result = result.filter(v => (v.raw_data as any)?.gearbox === value);
        } else if (key === 'category') {
          result = result.filter(v => (v.raw_data as any)?.category === value);
        } else if (key === 'color') {
          result = result.filter(v => (v.raw_data as any)?.exteriorColor === value);
        } else if (key === 'condition') {
          result = result.filter(v => (v.raw_data as any)?.condition === value);
        } else if (key === 'location') {
          result = result.filter(v => String((v.raw_data as any)?.location || "").toLowerCase().includes(String(value).toLowerCase()));
        } else if (key === 'price') {
          result = result.filter(v => {
            const p = (v.raw_data as any)?.price?.consumerPriceGross || 0;
            if (typeof value === 'string') {
               if (value.includes('bis 15.000')) return p <= 15000;
               if (value.includes('bis 20.000')) return p <= 20000;
               if (value.includes('bis 25.000')) return p <= 25000;
               if (value.includes('bis 30.000')) return p <= 30000;
               if (value.includes('bis 35.000')) return p <= 35000;
               if (value.includes('bis 40.000')) return p <= 40000;
               if (value.includes('bis 50.000')) return p <= 50000;
               if (value.includes('20.000 - 30.000')) return p > 20000 && p <= 30000;
               if (value.includes('30.000 - 40.000')) return p > 30000 && p <= 40000;
               if (value.includes('40.000 - 50.000')) return p > 40000 && p <= 50000;
               if (value === "über 50.000 €") return p > 50000;
            }
            return true;
          });
        } else if (key === 'mileage') {
          result = result.filter(v => {
            const m = (v.raw_data as any)?.mileage || 0;
            if (typeof value === 'string') {
               if (value.includes('bis 5.000')) return m <= 5000;
               if (value.includes('bis 10.000')) return m <= 10000;
               if (value.includes('bis 20.000')) return m <= 20000;
               if (value.includes('bis 50.000')) return m <= 50000;
               if (value.includes('bis 100.000')) return m <= 100000;
               if (value === "über 50.000 km") return m > 50000;
            }
            return true;
          });
        }
      });
      return result;
    };

    return {
      brands: extract('make', applyFilters(initialVehicles, filters, 'brand')),
      models: extract('model', applyFilters(initialVehicles, filters, 'model')),
      fuels: extract('fuel', applyFilters(initialVehicles, filters, 'fuel')),
      gearboxes: extract('gearbox', applyFilters(initialVehicles, filters, 'gearbox')),
      categories: extract('category', applyFilters(initialVehicles, filters, 'category')),
      colors: extract('exteriorColor', applyFilters(initialVehicles, filters, 'color')),
      conditions: extract('condition', applyFilters(initialVehicles, filters, 'condition'))
    };
  }, [initialVehicles, filters]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      const element = document.getElementById('inventory-results');
      if (element) {
        const offset = 120; // Adjust for sticky header
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
    };

    return (
      <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 md:px-10 rounded-[2.5rem] border border-gray-100 shadow-sm gap-8 font-bold text-xs">
        <div className="text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
          <span className="text-brand-dark font-black text-sm">{filteredVehicles.length}</span> 
          <span>Ergebnisse</span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* First / Prev */}
          <button 
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === 1 ? 'text-gray-200 cursor-not-allowed' : 'bg-brand-gray/50 text-brand-dark hover:bg-brand-orange hover:text-white shadow-sm'}`}
            title="Erste Seite"
          >
            <ChevronLeft size={16} />
            <ChevronLeft size={16} className="-ml-3" />
          </button>
          
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === 1 ? 'text-gray-200 cursor-not-allowed' : 'bg-brand-gray/50 text-brand-dark hover:bg-brand-orange hover:text-white shadow-sm'}`}
            title="Vorherige Seite"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page Numbers */}
          {startPage > 1 && (
            <>
              <button 
                onClick={() => handlePageChange(1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-gray/50 text-brand-dark hover:bg-brand-orange hover:text-white transition-all"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-300 px-1">...</span>}
            </>
          )}

          {pages.map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all font-black ${
                currentPage === page 
                  ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30 scale-110 z-10' 
                  : 'bg-brand-gray/50 text-brand-dark hover:bg-white hover:shadow-md'
              }`}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-300 px-1">...</span>}
              <button 
                onClick={() => handlePageChange(totalPages)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-gray/50 text-brand-dark hover:bg-brand-orange hover:text-white transition-all"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next / Last */}
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === totalPages ? 'text-gray-200 cursor-not-allowed' : 'bg-brand-gray/50 text-brand-dark hover:bg-brand-orange hover:text-white shadow-sm'}`}
            title="Nächste Seite"
          >
            <ChevronRight size={16} />
          </button>

          <button 
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === totalPages ? 'text-gray-200 cursor-not-allowed' : 'bg-brand-gray/50 text-brand-dark hover:bg-brand-orange hover:text-white shadow-sm'}`}
            title="Letzte Seite"
          >
            <ChevronRight size={16} />
            <ChevronRight size={16} className="-ml-3" />
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-4 text-gray-400 uppercase tracking-widest text-[10px]">
           <span>Pro Seite:</span>
           <div className="bg-brand-gray flex items-center gap-2 px-4 py-2 rounded-xl text-brand-dark font-black border border-gray-100 italic opacity-80">
             40
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12" id="inventory-results">
      {/* Search Header */}
      <div className="bg-white border rounded-[2rem] px-6 md:px-12 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-brand-dark uppercase tracking-tighter">Fahrzeugbestand</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Exklusives Angebot von Auto Wiegand</p>
        </div>
      </div>

      <InventoryFilterGrid 
        filters={filters} 
        setFilters={handleFilterChange} 
        options={dynamicOptions} 
        onReset={resetFilters}
      />

      {renderPagination()}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {paginatedVehicles.map((v) => {
          const ad = (v.raw_data as any) || {};
          const mileage = ad.mileage ? new Intl.NumberFormat('de-DE').format(ad.mileage) : '0';
          const regDate = ad.firstRegistration ? new Date(ad.firstRegistration).getFullYear() : 'NEU';

          const tech = formatTechSpecs(ad);

          return (
            <div key={v.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-brand-orange/20 transition-all overflow-hidden group">
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img 
                  src={v.image && v.image !== "" ? v.image : "/images/betrieb.jpg"} 
                  alt={v.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
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
                      onError={(e) => {
                        (e.target as HTMLImageElement).classList.add('hidden');
                      }}
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
