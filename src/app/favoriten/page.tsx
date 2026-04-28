import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import InventoryManager from "@/components/inventory/InventoryManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoriten | Autohaus Wiegand",
  description: "Ihre gemerkten Fahrzeuge im Überblick.",
};

export const dynamic = 'force-dynamic';

export default async function FavoritesPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  // Extract unique options for filters
  const extract = (key: string, data: any[]) => {
    return Array.from(new Set(data.map(v => v.raw_data?.[key] || v[key]).filter(Boolean))).sort();
  };

  const options = {
    brands: extract('make', vehicles || []),
    models: extract('model', vehicles || []),
    fuels: extract('fuel', vehicles || []),
    gearboxes: extract('gearbox', vehicles || []),
    categories: extract('category', vehicles || []),
    colors: extract('exteriorColor', vehicles || [])
  };

  return (
    <div className="bg-[#F2F2F2] min-h-screen pb-40">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Meine Merkliste</h1>
          <p className="text-gray-500 text-sm mt-2">Ihre favorisierten Fahrzeuge auf einen Blick.</p>
        </div>
        <InventoryManager 
          key={JSON.stringify(resolvedSearchParams)}
          initialVehicles={vehicles || []} 
          options={options} 
          serverSearchParams={resolvedSearchParams}
          showOnlyFavorites={true}
        />
      </div>
    </div>
  );
}
