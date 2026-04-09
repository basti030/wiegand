"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Settings, 
  LogOut, 
  RefreshCw,
  Bell
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isImporting, setIsImporting] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Fahrzeuge", href: "/admin/vehicles", icon: Car },
    { name: "Mitarbeiter", href: "/admin/employees", icon: Users },
    { name: "Einstellungen", href: "/admin/settings", icon: Settings },
  ];

  const handleSync = async () => {
    if (!confirm("Möchten Sie den Fahrzeug-Sync jetzt starten?")) return;
    setIsImporting(true);
    try {
      const res = await fetch('/api/admin/import-vehicles', { method: 'POST' });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("Fehler beim Starten des Imports");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-brand-dark text-white flex flex-col fixed h-full z-30 shadow-2xl">
        <div className="p-8">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20 transition-transform group-hover:scale-110">
              <RefreshCw className="text-white" size={20} />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter">Wiegand <span className="text-brand-orange">Admin</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4 mb-4">Hauptmenü</div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  isActive 
                    ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20 translate-x-1" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-gray-500"} />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-8 px-4">
            <button 
              onClick={handleSync}
              disabled={isImporting}
              className="w-full flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-sm font-bold disabled:opacity-50 group"
            >
              <RefreshCw size={18} className={`${isImporting ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
              {isImporting ? "Sync läuft..." : "Bestand Sync"}
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all text-sm font-bold">
            <LogOut size={20} /> Abmelden
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="text-sm font-bold text-gray-400">
            Willkommen zurück, <span className="text-brand-dark">Administrator</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-brand-dark transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-black text-brand-dark uppercase">Admin User</div>
                <div className="text-[10px] font-bold text-gray-400">Super Admin</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-gray flex items-center justify-center font-black text-brand-dark text-xs border border-gray-100">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
