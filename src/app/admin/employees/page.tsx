"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit2, Trash2, Loader2, Mail, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  image_url?: string;
}

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (err: any) {
      console.error('Error fetching employees:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-brand-dark uppercase tracking-tighter">Mitarbeiterverwaltung</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Teamübersicht & Rollenverteilung ({employees.length})</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl shadow-xl shadow-brand-orange/20">
          <Plus size={20} /> Neuer Mitarbeiter
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-brand-orange" size={40} />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Mitarbeiter werden geladen...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="p-20 text-center">
            <Users className="mx-auto text-gray-200 mb-6" size={64} />
            <p className="text-lg font-bold text-brand-dark mb-2">Keine Mitarbeiter gefunden</p>
            <p className="text-sm text-gray-400">Nutzen Sie den Button oben, um Ihren ersten Mitarbeiter anzulegen.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-brand-gray/50 border-b">
              <tr>
                <th className="p-8 font-black text-brand-dark uppercase text-[10px] tracking-widest">Mitarbeiter</th>
                <th className="p-8 font-black text-brand-dark uppercase text-[10px] tracking-widest">Rolle</th>
                <th className="p-8 font-black text-brand-dark uppercase text-[10px] tracking-widest">Abteilung/Standort</th>
                <th className="p-8 font-black text-brand-dark uppercase text-[10px] tracking-widest text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-brand-gray/30 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      {emp.image_url ? (
                        <div className="w-12 h-12 rounded-xl border-2 border-white shadow-sm overflow-hidden shrink-0">
                          <img src={emp.image_url} alt={emp.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-brand-gray flex items-center justify-center text-gray-400 shrink-0">
                          <Users size={20} />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-brand-dark group-hover:text-brand-orange transition-colors">{emp.name}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <Mail size={10} /> {emp.email}
                          </div>
                          {emp.phone && (
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              <Phone size={10} /> {emp.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-sm font-bold text-gray-600">{emp.role}</td>
                  <td className="p-8">
                    <span className="px-4 py-1.5 bg-brand-gray text-brand-dark text-[10px] font-black uppercase tracking-widest rounded-full">
                      {emp.department}
                    </span>
                  </td>
                  <td className="p-8 text-right space-x-2">
                    <button title="Bearbeiten" className="p-3 bg-brand-gray text-gray-400 hover:text-brand-orange hover:bg-white transition-all rounded-xl border border-transparent hover:border-brand-orange/20 shadow-sm">
                      <Edit2 size={18} />
                    </button>
                    <button title="Löschen" className="p-3 bg-brand-gray text-gray-400 hover:text-red-500 hover:bg-white transition-all rounded-xl border border-transparent hover:border-red-100 shadow-sm">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
