import { supabase } from "@/lib/supabase";
import { 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  TrendingUp,
  Activity
} from "lucide-react";

import { ManualSyncButton } from "@/components/admin/ManualSyncButton";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const { count: totalVehicles } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true });

  const { data: recentLogs } = await supabase
    .from('import_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { label: "Gesamtbestand", value: totalVehicles || 0, icon: Car, color: "text-blue-600", bg: "bg-blue-50" },
    { 
      label: "Letzter Sync", 
      value: recentLogs?.[0]?.status === 'SUCCESS' ? "Erfolg" : recentLogs?.[0]?.status === 'RUNNING' ? "Aktiv" : "Fehler", 
      icon: Activity, 
      color: recentLogs?.[0]?.status === 'SUCCESS' ? "text-green-600" : recentLogs?.[0]?.status === 'RUNNING' ? "text-blue-600" : "text-red-600",
      bg: recentLogs?.[0]?.status === 'SUCCESS' ? "bg-green-50" : recentLogs?.[0]?.status === 'RUNNING' ? "bg-blue-50" : "bg-red-50"
    },
    { label: "Fehler (Vorgang)", value: recentLogs?.filter(l => l.status === 'ERROR').length || 0, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Neu heute", value: "0", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Dashboard</h1>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Systemübersicht & Lokaler Bestand</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{stat.label}</div>
              <div className="text-4xl font-black text-brand-dark tracking-tighter">{stat.value}</div>
            </div>
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-110`}>
              <stat.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sync History */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <History className="text-brand-orange" /> Sync Historie
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-brand-orange hover:underline">Alle anzeigen</button>
          </div>

          <div className="space-y-6">
            {recentLogs && recentLogs.length > 0 ? (
              recentLogs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between p-6 bg-brand-gray rounded-3xl border border-gray-100 group">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {log.status === 'SUCCESS' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div>
                      <div className="font-bold text-brand-dark capitalize">Bestand-Synchronisation</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {new Date(log.created_at).toLocaleString('de-DE')} • {log.vehicles_processed} Fahrzeuge
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-black uppercase tracking-widest ${log.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
                      {log.status}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400">{log.details?.duration_ms}ms</div>
                    {log.status === 'ERROR' && log.details?.error && (
                      <div className="text-[10px] text-red-400 font-bold max-w-[200px] truncate mt-1" title={log.details.error}>
                        {log.details.error}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center mb-6">
                  <Activity size={32} className="text-gray-300" />
                </div>
                <h4 className="text-lg font-bold text-gray-400 mb-2">Noch keine Logs vorhanden</h4>
                <p className="text-sm text-gray-400 max-w-xs">Starten Sie den ersten Sync, um die Historie zu sehen.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
          <h3 className="text-xl font-black uppercase tracking-tight mb-8">Quick Actions</h3>
          <div className="space-y-4">
            <ManualSyncButton />
            <button className="w-full flex items-center justify-between p-5 bg-brand-dark text-white rounded-2xl hover:bg-brand-orange transition-all group shadow-xl shadow-brand-dark/10">
              <span className="font-bold text-sm">Download Report</span>
              <Car size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-5 bg-brand-gray text-brand-dark rounded-2xl hover:bg-gray-200 transition-all group border border-gray-100">
              <span className="font-bold text-sm">Bestand Exportieren</span>
              <Activity size={18} className="text-gray-400" />
            </button>
            <div className="pt-10 border-t mt-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">System Status</div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-600">Datenbank</span>
                <span className="flex items-center gap-2 text-xs font-black text-green-500 uppercase tracking-widest"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-600">SFTP Server</span>
                <span className="flex items-center gap-2 text-xs font-black text-green-500 uppercase tracking-widest"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Bereit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
