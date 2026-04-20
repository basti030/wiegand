import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import InventoryManager from "@/components/inventory/InventoryManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fahrzeugbestand | Autohaus Wiegand – SEAT, CUPRA & SKODA",
  description: "Entdecken Sie unsere große Auswahl an Neu- und Gebrauchtwagen sowie erstklassigen Werkstatt-Service in Büdingen und Gelnhausen.",
};

export const dynamic = 'force-dynamic';

export default async function VehiclesPage({ searchParams }: { searchParams: Promise<any> }) {
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
    <div className="bg-brand-gray min-h-screen pb-40">
      <div className="container mx-auto px-4 py-20">
        <InventoryManager 
          key={JSON.stringify(resolvedSearchParams)}
          initialVehicles={vehicles || []} 
          options={options} 
          serverSearchParams={resolvedSearchParams}
        />
      </div>
    </div>
  );
}
