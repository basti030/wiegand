import { useState } from "react";
import { ChevronDown, RefreshCw, Filter, X } from "lucide-react";

interface FilterGridProps {
  filters: any;
  setFilters: (filters: any) => void;
  options: {
    brands: string[];
    models: string[];
    fuels: string[];
    gearboxes: string[];
    categories: string[];
    colors: string[];
  };
  onReset: () => void;
}

export default function InventoryFilterGrid({ filters, setFilters, options, onReset }: FilterGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const filterConfigs = [
    { key: "location", label: "Standort", options: ["Alle Standorte", "Büdingen", "Gelnhausen"] },
    { key: "condition", label: "Fahrzeugzustand", options: ["Alle Zustände", "NEW", "USED"], labels: { "NEW": "Neuwagen", "USED": "Gebrauchtwagen" } },
    { key: "brand", label: "Hersteller", options: ["Alle Hersteller", ...options.brands] },
    { key: "model", label: "Modell", options: ["Alle Modelle", ...options.models] },
    { key: "category", label: "Fahrzeugtyp", options: ["Alle Typen", ...options.categories], labels: { "EstateCar": "Kombi", "Limousine": "Limousine", "OffRoad": "SUV", "SmallCar": "Kleinwagen", "SportsCar": "Sportwagen", "Van": "Van" } },
    
    { key: "mileage", label: "Kilometerstand", options: ["Beliebig", "bis 5.000 km", "bis 10.000 km", "bis 20.000 km", "bis 50.000 km", "über 50.000 km"] },
    { key: "registration", label: "Erstzulassung", options: ["Beliebig", "2024", "2023", "2022", "2021", "älter"] },
    { key: "power", label: "Leistung (PS)", options: ["Beliebig", "bis 100 PS", "100 - 150 PS", "150 - 200 PS", "über 200 PS"] },
    { key: "fuel", label: "Kraftstoffart", options: ["Alle Kraftstoffe", ...options.fuels], labels: { "PETROL": "Benzin", "DIESEL": "Diesel", "ELECTRICITY": "Elektro", "HYBRID": "Hybrid", "CNG": "Gas" } },
    { key: "color", label: "Außenfarbe", options: ["Alle Farben", ...options.colors], labels: { "BLACK": "Schwarz", "BLUE": "Blau", "GREEN": "Grün", "GREY": "Grau", "ORANGE": "Orange", "RED": "Rot", "SILVER": "Silber", "WHITE": "Weiß" } },
    
    { key: "gearbox", label: "Getriebe", options: ["Alle Getriebe", ...options.gearboxes], labels: { "AUTOMATIC_GEAR": "Automatik", "MANUAL_GEAR": "Schaltgetriebe" } },
    { key: "doors", label: "Türen", options: ["Beliebig", "2/3", "4/5"] },
    { key: "seats", label: "Anzahl Sitzplätze", options: ["Beliebig", "2", "4", "5", "7"] },
    { key: "highlights", label: "Ausstattung", options: ["Beliebig", "Navigationssystem", "Sitzheizung", "Klimaautomatik", "LED-Scheinwerfer"] },
    { key: "price", label: "Preis", options: ["Beliebig", "bis 20.000 €", "20.000 - 30.000 €", "30.000 - 40.000 €", "40.000 - 50.000 €", "über 50.000 €"] },
  ];

  return (
    <div className="bg-white border rounded-3xl shadow-sm p-4 md:p-8 mb-10 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
           <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className="lg:hidden flex items-center justify-center gap-3 bg-brand-dark text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest w-full md:w-auto transition-all active:scale-95"
           >
             {isExpanded ? <X size={16} /> : <Filter size={16} />}
             {isExpanded ? 'Filter schließen' : 'Fahrzeuge filtern'}
           </button>

           <div className={`flex items-center gap-4 w-full md:w-auto ${isExpanded ? 'flex' : 'hidden lg:flex'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 hidden sm:inline">Sortierung:</span>
              <select 
                className="w-full md:w-auto text-[11px] font-black uppercase tracking-widest bg-brand-gray border-none rounded-xl px-5 py-3 cursor-pointer outline-none focus:ring-2 focus:ring-brand-orange/20"
                value={filters.sort || "newest"}
                onChange={(e) => updateFilter("sort", e.target.value)}
              >
                <option value="newest">Neueste zuerst</option>
                <option value="price_asc">Preis (aufst.)</option>
                <option value="price_desc">Preis (abst.)</option>
                <option value="mileage_asc">KM (aufst.)</option>
              </select>
           </div>
        </div>
        <button 
          onClick={onReset}
          className={`text-[10px] font-black uppercase tracking-widest text-brand-orange hover:text-brand-dark transition-colors flex items-center gap-2 px-2 ${isExpanded ? 'flex' : 'hidden lg:flex'}`}
        >
          <RefreshCw size={14} /> Filter zurücksetzen
        </button>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'hidden lg:grid'}`}>
        {filterConfigs.map((config) => (
          <div key={config.key} className="relative group">
            <select
              className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-[12px] font-bold text-brand-dark appearance-none outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 transition-all cursor-pointer hover:bg-gray-50"
              value={filters[config.key] || config.options[0]}
              onChange={(e) => updateFilter(config.key, e.target.value)}
              title={config.label}
              aria-label={config.label}
            >
              {config.options.map((opt) => (
                <option key={opt} value={opt}>
                  {(config.labels as any)?.[opt] || opt}
                </option>
              ))}
            </select>
            <div className="absolute top-0 left-5 -translate-y-1/2 bg-white px-2">
               <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 group-focus-within:text-brand-orange transition-colors">
                 {config.label}
               </span>
            </div>
            <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-focus-within:text-brand-orange" />
          </div>
        ))}
      </div>
    </div>
  );
}

