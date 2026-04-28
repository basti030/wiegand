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
  serverSearchParams?: any;
  showOnlyFavorites?: boolean;
}

const ITEMS_PER_PAGE = 40;

export default function InventoryManager({ initialVehicles, options, serverSearchParams, showOnlyFavorites = false }: InventoryManagerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Helper to find range label for a numeric value
  const getPriceLabel = (val: number) => {
    if (val <= 15000) return "bis 15.000 €";
    if (val <= 20000) return "bis 20.000 €";
    if (val <= 25000) return "bis 25.000 €";
    if (val <= 30000) return "bis 30.000 €";
    if (val <= 35000) return "bis 35.000 €";
    if (val <= 40000) return "bis 40.000 €";
    if (val <= 50000) return "bis 50.000 €";
    return "über 50.000 €";
  };

  const getMileageLabel = (val: number) => {
    if (val <= 5000) return "bis 5.000 km";
    if (val <= 10000) return "bis 10.000 km";
    if (val <= 20000) return "bis 20.000 km";
    if (val <= 50000) return "bis 50.000 km";
    if (val <= 100000) return "bis 100.000 km";
    return "über 50.000 km";
  };

  // Use local state for filters to ensure immediate and stable updates
  const [filters, setFilters] = useState<any>(() => {
    const params: any = { sort: "newest" };
    try {
      // 1. First, use server-side params if available (fixes hydration)
      if (serverSearchParams) {
        Object.entries(serverSearchParams).forEach(([key, value]) => {
          const val = Array.isArray(value) ? value[0] : value;
          if (val) {
            if (key === 'price' && !isNaN(Number(val))) {
              params.price = getPriceLabel(Number(val));
            } else if (key === 'mileage' && !isNaN(Number(val))) {
              params.mileage = getMileageLabel(Number(val));
            } else {
              params[key] = val;
            }
          }
        });
        return params;
      }

      // 2. Fallback to client-side window if server params missing
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
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem("wiegand_favs");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const toggleFavorite = (id: string) => {
    let newFavs = [...favorites];
    if (newFavs.includes(id)) {
      newFavs = newFavs.filter(item => item !== id);
    } else {
      newFavs.push(id);
    }
    setFavorites(newFavs);
    localStorage.setItem("wiegand_favs", JSON.stringify(newFavs));
    window.dispatchEvent(new Event("favorites-updated"));
  };

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
      let result = [...initialVehicles].filter(v => {
        const invalidTitle = !v.title || v.title === "Fahrzeug ohne Titel" || v.title === "";
        const invalidModel = !(v.raw_data as any)?.model;
        return !(invalidTitle && invalidModel);
      });
      
      if (showOnlyFavorites) {
        result = result.filter(v => favorites.includes(v.id));
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(v => {
          const title = String(v.title || "").toLowerCase();
          const brand = String(v.brand || "").toLowerCase();
          const jsonString = JSON.stringify(v.raw_data || {}).toLowerCase();
          
          const colorMap: Record<string, string> = {
            "BLACK": "schwarz", "BLUE": "blau", "GREEN": "grün", 
            "GREY": "grau", "ORANGE": "orange", "RED": "rot", 
            "SILVER": "silber", "WHITE": "weiß"
          };
          const rawColor = String((v.raw_data as any)?.exteriorColor || "").toUpperCase();
          const mappedColor = colorMap[rawColor] || "";

          return title.includes(term) || 
                 brand.includes(term) || 
                 jsonString.includes(term) || 
                 mappedColor.includes(term);
        });
      }

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
      if (filters.doors && filters.doors !== "Beliebig") {
        result = result.filter(v => {
          const d = (v.raw_data as any)?.doors || (v.raw_data as any)?.numberOfDoors;
          const numDoors = parseInt(String(d));
          if (isNaN(numDoors)) return false;
          if (filters.doors === "2/3") return numDoors === 2 || numDoors === 3;
          if (filters.doors === "4/5") return numDoors === 4 || numDoors === 5;
          return true;
        });
      }
      if (filters.seats && filters.seats !== "Beliebig") {
        result = result.filter(v => {
          const s = (v.raw_data as any)?.seats || (v.raw_data as any)?.numSeats;
          return String(s) === String(filters.seats);
        });
      }
      if (filters.registration && filters.registration !== "Beliebig") {
        result = result.filter(v => {
          const ez = String((v.raw_data as any)?.firstRegistration || "");
          const year = ez.substring(0, 4);
          if (filters.registration === "älter") return year && parseInt(year) < 2021;
          return year === filters.registration;
        });
      }
      if (filters.power && filters.power !== "Beliebig") {
        result = result.filter(v => {
          const kw = (v.raw_data as any)?.power;
          if (!kw) return false;
          const ps = Math.round(kw * 1.35962);
          if (filters.power === "bis 100 PS") return ps <= 100;
          if (filters.power === "100 - 150 PS") return ps > 100 && ps <= 150;
          if (filters.power === "150 - 200 PS") return ps > 150 && ps <= 200;
          if (filters.power === "über 200 PS") return ps > 200;
          return true;
        });
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
  }, [filters, initialVehicles, searchTerm, favorites, showOnlyFavorites]);

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
        } else if (key === 'doors') {
          result = result.filter(v => {
            const d = (v.raw_data as any)?.doors || (v.raw_data as any)?.numberOfDoors;
            const numDoors = parseInt(String(d));
            if (isNaN(numDoors)) return false;
            if (value === "2/3") return numDoors === 2 || numDoors === 3;
            if (value === "4/5") return numDoors === 4 || numDoors === 5;
            return true;
          });
        } else if (key === 'seats') {
          result = result.filter(v => {
            const s = (v.raw_data as any)?.seats || (v.raw_data as any)?.numSeats;
            return String(s) === String(value);
          });
        } else if (key === 'registration') {
          result = result.filter(v => {
            const ez = String((v.raw_data as any)?.firstRegistration || "");
            const year = ez.substring(0, 4);
            if (value === "älter") return year && parseInt(year) < 2021;
            return year === value;
          });
        } else if (key === 'power') {
          result = result.filter(v => {
            const kw = (v.raw_data as any)?.power;
            if (!kw) return false;
            const ps = Math.round(kw * 1.35962);
            if (value === "bis 100 PS") return ps <= 100;
            if (value === "100 - 150 PS") return ps > 100 && ps <= 150;
            if (value === "150 - 200 PS") return ps > 150 && ps <= 200;
            if (value === "über 200 PS") return ps > 200;
            return true;
          });
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

  const filterConfigs = [
    { key: "location", label: "Standort", options: ["Alle Standorte", "Büdingen", "Gelnhausen"] },
    { key: "condition", label: "Fahrzeugzustand", options: ["Alle Zustände", ...(options.conditions || ["NEW", "USED"])], labels: { "NEW": "Neuwagen", "USED": "Gebrauchtwagen" } },
    { key: "brand", label: "Hersteller", options: ["Alle Hersteller", ...(options.brands || [])] },
    { key: "model", label: "Modell", options: ["Alle Modelle", ...(options.models || [])] },
    { key: "category", label: "Fahrzeugtyp", options: ["Alle Typen", ...(options.categories || [])], labels: { "EstateCar": "Kombi", "Limousine": "Limousine", "OffRoad": "SUV", "SmallCar": "Kleinwagen", "SportsCar": "Sportwagen", "Van": "Van" } },
    { key: "mileage", label: "Kilometerstand", options: ["Beliebig", "bis 5.000 km", "bis 10.000 km", "bis 20.000 km", "bis 50.000 km", "über 50.000 km"] },
    { key: "registration", label: "Erstzulassung", options: ["Beliebig", "2024", "2023", "2022", "2021", "älter"] },
    { key: "power", label: "Leistung (PS)", options: ["Beliebig", "bis 100 PS", "100 - 150 PS", "150 - 200 PS", "über 200 PS"] },
    { key: "fuel", label: "Kraftstoffart", options: ["Alle Kraftstoffe", ...(options.fuels || [])], labels: { "PETROL": "Benzin", "DIESEL": "Diesel", "ELECTRICITY": "Elektro", "HYBRID": "Hybrid", "CNG": "Gas" } },
    { key: "color", label: "Außenfarbe", options: ["Alle Farben", ...(options.colors || [])], labels: { "BLACK": "Schwarz", "BLUE": "Blau", "GREEN": "Grün", "GREY": "Grau", "ORANGE": "Orange", "RED": "Rot", "SILVER": "Silber", "WHITE": "Weiß" } },
    { key: "gearbox", label: "Getriebe", options: ["Alle Getriebe", ...(options.gearboxes || [])], labels: { "AUTOMATIC_GEAR": "Automatik", "MANUAL_GEAR": "Schaltgetriebe" } },
    { key: "doors", label: "Türen", options: ["Beliebig", "2/3", "4/5"] },
    { key: "price", label: "Preis bis", options: ["Beliebig", "bis 15.000 €", "bis 20.000 €", "bis 25.000 €", "bis 35.000 €", "bis 50.000 €", "über 50.000 €"] },
  ];

  const quickTags = [
    { key: "condition", value: "NEW", label: "Neuwagen" },
    { key: "condition", value: "USED", label: "Gebrauchtwagen" },
    { key: "fuel", value: "PETROL", label: "Benzin" },
    { key: "fuel", value: "DIESEL", label: "Diesel" },
    { key: "fuel", value: "ELECTRICITY", label: "Elektro" },
    { key: "fuel", value: "HYBRID", label: "Hybrid" },
    { key: "gearbox", value: "AUTOMATIC_GEAR", label: "Automatik" },
    { key: "gearbox", value: "MANUAL_GEAR", label: "Schaltgetriebe" },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6" id="inventory-results">
      {/* Top Search Bar & Quick Tags */}
      <div className="bg-[#F2F2F2] p-6 rounded-xl border border-gray-200">
        <div className="relative flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input 
            type="text" 
            placeholder="Suche nach Marke, Modell, Farbe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3.5 text-base font-medium text-gray-900 outline-none"
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto py-1 no-scrollbar">
          {quickTags.map((tag) => {
            const isActive = filters[tag.key] === tag.value;
            return (
              <button
                key={tag.label}
                onClick={() => handleFilterChange(tag.key, isActive ? "Beliebig" : tag.value)}
                className={`px-4 py-2 text-sm font-bold rounded border transition-all shrink-0 ${
                  isActive 
                    ? "bg-brand-orange text-white border-brand-orange" 
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar: Filters */}
      <aside className="w-full lg:w-[300px] shrink-0 bg-white p-6 rounded-xl border border-gray-200 h-fit">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Filter</h3>
          <button 
            onClick={resetFilters}
            className="text-xs font-bold text-brand-orange hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            Zurücksetzen
          </button>
        </div>

        <div className="space-y-6">
          {filterConfigs.map((config) => (
            <div key={config.key} className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {config.label}
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-brand-orange focus:bg-white transition-colors cursor-pointer appearance-none"
                value={filters[config.key] || config.options[0]}
                onChange={(e) => handleFilterChange(config.key, e.target.value)}
              >
                {config.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {(config.labels as any)?.[opt] || opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </aside>

      {/* Right: Vehicle Listings */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div className="text-sm font-bold text-gray-500">
            {filteredVehicles.length} Treffer
          </div>
          
          {/* Sorting */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sortierung:</span>
            <select 
              className="text-sm font-bold bg-white border border-gray-200 rounded-lg px-4 py-2 cursor-pointer outline-none"
              value={filters.sort || "newest"}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              <option value="newest">Neueste zuerst</option>
              <option value="price_asc">Preis (aufsteigend)</option>
              <option value="price_desc">Preis (absteigend)</option>
              <option value="mileage_asc">Kilometer (aufsteigend)</option>
            </select>
          </div>
        </div>

        {renderPagination()}
        <div className="h-6"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedVehicles.map((v) => {
            const ad = (v.raw_data as any) || {};
            const mileage = ad.mileage ? new Intl.NumberFormat('de-DE').format(ad.mileage) : '0';
            const regDate = (() => {
              if (!ad.firstRegistration) return 'NEU';
              const s = String(ad.firstRegistration);
              const match = s.match(/\d{4}/);
              return match ? match[0] : 'NEU';
            })();

            const tech = formatTechSpecs(ad);
            const brandLogo = `/images/${(v.brand || 'wiegand').toLowerCase()}.svg`;

            return (
              <div key={v.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col group relative">
                {/* Image Area */}
                {/* Image Area */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Link href={`/fahrzeuge/${v.external_id}`} className="block w-full h-full">
                    <img 
                      src={v.image && v.image !== "" ? v.image : "/images/betrieb.jpg"} 
                      alt={v.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </Link>
                  
                  {/* Brand Logo Overlay */}
                  {!failedLogos[v.id] && (
                    <div className="absolute top-3 left-3 bg-white/90 p-1.5 rounded pointer-events-none">
                      <img 
                        src={brandLogo} 
                        alt={v.brand} 
                        className="h-3.5 object-contain" 
                        onError={() => setFailedLogos(prev => ({ ...prev, [v.id]: true }))} 
                      />
                    </div>
                  )}
                  
                  {/* Heart / Favorite button */}
                  <button 
                    onClick={() => toggleFavorite(v.id)}
                    className={`absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center transition-colors shadow-sm z-10 ${
                      favorites.includes(v.id) ? "text-brand-orange" : "text-gray-400 hover:text-brand-orange"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={favorites.includes(v.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/fahrzeuge/${v.external_id}`} className="mb-2">
                    <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-brand-orange transition-colors line-clamp-1">
                      {v.brand} {v.title && v.title !== "Fahrzeug ohne Titel" ? v.title.replace(v.brand || '', '').trim() : (ad.model || 'Angebot')}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                      {ad.modelDescription || 'Attraktives Angebot'}
                    </p>
                  </Link>

                  <div className="text-xl font-bold text-gray-900 mt-auto pt-4">
                    {v.price}
                  </div>
                  
                  <div className="text-[11px] text-gray-400 mt-1 flex flex-col gap-0.5 border-t border-gray-100 pt-3">
                    <div>{ad.condition === 'NEW' ? 'Neuwagen' : `Erstzulassung: ${regDate}`}</div>
                    <div>{mileage} km | {v.power || '110 kW'} | {v.fuel_type || 'Benzin'}</div>
                  </div>

                  <div className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-100 flex flex-col gap-0.5">
                    <div><strong>WLTP:</strong> Verbrauch komb.: {tech.consumption}</div>
                    <div>CO₂-Emissionen komb.: {tech.co2}</div>
                    <div>CO₂ Klasse: {tech.co2Class}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="py-20 text-center bg-white border border-gray-200 rounded-xl">
            <div className="text-gray-400 text-sm font-medium">
              Keine Fahrzeuge entsprechend Ihrer Filterkriterien gefunden.
            </div>
          </div>
        )}

        <div className="h-12"></div>
        {renderPagination()}
      </div>
    </div>
  </div>
);
}
