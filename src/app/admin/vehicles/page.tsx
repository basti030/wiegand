import { supabase } from "@/lib/supabase";
import VehiclesTable from "@/components/admin/VehiclesTable";

export const dynamic = 'force-dynamic';

export default async function AdminVehicles() {
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Fahrzeugbestand</h1>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Verwaltung & Status der synchronisierten Fahrzeuge</p>
      </div>

      <VehiclesTable initialVehicles={vehicles || []} />
    </div>
  );
}
