"use client";

import { useState } from "react";
import { 
  Search, 
  Eye, 
  RefreshCw,
  Trash2,
  ImageIcon,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface VehiclesTableProps {
  initialVehicles: any[];
}

export default function VehiclesTable({ initialVehicles }: VehiclesTableProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const filteredVehicles = vehicles.filter(v => 
    v.title?.toLowerCase().includes(search.toLowerCase()) || 
    v.brand?.toLowerCase().includes(search.toLowerCase()) ||
    v.external_id?.toString().includes(search)
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Möchten Sie das Fahrzeug "${title}" wirklich unwiderruflich löschen?`)) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        setVehicles(prev => prev.filter(v => v.id !== id));
        router.refresh(); // Update stats in dashboard etc.
      } else {
        alert(data.message || "Fehler beim Löschen");
      }
    } catch (err) {
      alert("Netzwerkfehler beim Löschen des Fahrzeugs");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Fahrzeug suchen (ID, Marke, Modell)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold outline-none focus:border-brand-orange/30 w-96 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-gray/50 border-b">
            <tr>
              <th className="p-8 font-black text-brand-dark uppercase text-[10px] tracking-widest">Fahrzeug</th>
              <th className="p-8 font-black text-brand-dark uppercase text-[10px] tracking-widest text-center">Bilder</th>
              <th className="p-8 font-black text-brand-dark uppercase text-[10px] tracking-widest">Marke</th>
              <th className="p-8 font-black text-brand-dark uppercase text-[10px] tracking-widest">Preis</th>
              <th className="p-8 font-black text-brand-dark uppercase text-[10px] tracking-widest">Status</th>
              <th className="p-8 font-black text-brand-dark uppercase text-[10px] tracking-widest text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredVehicles.map(vehicle => (
              <tr key={vehicle.id} className={`hover:bg-brand-gray/30 transition-colors group ${isDeleting === vehicle.id ? 'opacity-50 pointer-events-none' : ''}`}>
                <td className="p-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-12 bg-brand-gray rounded-xl overflow-hidden relative border border-gray-100">
                      {vehicle.image ? (
                        <img src={vehicle.image} alt={vehicle.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-brand-dark group-hover:text-brand-orange transition-colors">
                        {vehicle.title || <span className="text-red-400 italic font-medium">Titel fehlt</span>}
                      </div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {vehicle.external_id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-8 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gray rounded-full text-[10px] font-black uppercase text-gray-500">
                    {(vehicle.raw_data as any)?.cloud_images?.length || 0} Assets
                  </div>
                </td>
                <td className="p-8">
                   <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${vehicle.brand ? 'bg-brand-orange' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-bold text-gray-600">{vehicle.brand || "k.A."}</span>
                   </div>
                </td>
                <td className="p-8">
                  <div className="text-sm font-black text-brand-dark">{vehicle.price}</div>
                </td>
                <td className="p-8">
                  <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {vehicle.status}
                  </span>
                </td>
                <td className="p-8 text-right space-x-2">
                  <Link 
                    href={`/fahrzeuge/${vehicle.external_id}`} 
                    target="_blank"
                    className="inline-flex p-3 bg-brand-gray text-gray-400 hover:text-brand-orange hover:bg-white transition-all rounded-xl border border-transparent hover:border-brand-orange/20 shadow-sm"
                    title="Ansehen"
                  >
                    <Eye size={18} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(vehicle.id, vehicle.title)}
                    disabled={isDeleting === vehicle.id}
                    className="p-3 bg-brand-gray text-gray-400 hover:text-red-500 hover:bg-white transition-all rounded-xl border border-transparent hover:border-red-100 shadow-sm"
                    title="Löschen"
                  >
                    <Trash2 size={18} className={isDeleting === vehicle.id ? "animate-pulse" : ""} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredVehicles.length === 0 && (
          <div className="p-32 text-center text-gray-400 font-bold uppercase tracking-widest text-xs flex flex-col items-center gap-4">
             <AlertCircle size={32} className="text-gray-200" />
             Keine Fahrzeuge in der Auswahl gefunden
          </div>
        )}
      </div>
    </div>
  );
}
