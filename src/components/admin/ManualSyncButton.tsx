"use client";

import React, { useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle, Play } from "lucide-react";
import { useRouter } from "next/navigation";

export function ManualSyncButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const router = useRouter();

  const handleSync = async () => {
    if (loading) return;
    
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/import-vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wait: true }), // Wait for completion for better manual feedback
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({ success: true, message: "Synchronisation erfolgreich abgeschlossen!" });
        // Refresh the page data to show new logs/vehicles
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        setResult({ 
          success: false, 
          message: data.message || data.error || "Fehler beim Import." 
        });
      }
    } catch (err) {
      setResult({ 
        success: false, 
        message: "Verbindungsfehler zur API." 
      });
    } finally {
      setLoading(false);
      // Clear result message after 10 seconds
      setTimeout(() => setResult(null), 10000);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <button
        onClick={handleSync}
        disabled={loading}
        className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all group shadow-xl ${
          loading 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-brand-orange text-white hover:bg-brand-dark shadow-brand-orange/20"
        }`}
      >
        <div className="flex items-center gap-3">
          {loading ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Play size={18} className="group-hover:translate-x-1 transition-transform" />
          )}
          <span className="font-bold text-sm">
            {loading ? "Sync läuft..." : "Synchronisation jetzt starten"}
          </span>
        </div>
        {!loading && <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Sync</span>}
      </button>

      {result && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold border ${
          result.success 
            ? "bg-green-50 text-green-700 border-green-100" 
            : "bg-red-50 text-red-700 border-red-100"
        }`}>
          {result.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}
