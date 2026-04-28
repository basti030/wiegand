"use client";

import React, { useState } from 'react';

interface VehicleInquiryFormProps {
  vehicleTitle: string;
  vehicleId: string;
}

export default function VehicleInquiryForm({ vehicleTitle, vehicleId }: VehicleInquiryFormProps) {
  const [formType, setFormType] = useState<'anfrage' | 'probefahrt'>('anfrage');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    anrede: '',
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    firma: '',
    nachricht: `Guten Tag, ich interessiere mich für das Fahrzeug ${vehicleTitle} (Nr. ${vehicleId}). Bitte senden Sie mir weitere Informationen.`
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulating submission success
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-[#fcfcfc] border border-[#EEEEEE] p-12 text-center rounded-none shadow-sm max-w-[900px] mx-auto mt-12">
        <div className="text-[#009FE3] text-4xl mb-4 font-black">✓</div>
        <h3 className="text-[22px] font-extrabold text-gray-900 mb-2">Vielen Dank für Ihre Anfrage!</h3>
        <p className="text-gray-600 text-[15px] max-w-md mx-auto font-medium">
          Wir haben Ihre Nachricht erhalten und einer unserer Verkaufsberater wird sich zeitnah bei Ihnen melden.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16 max-w-[1000px] mx-auto" id="anfrage-form">
      <h2 className="text-[32px] font-black text-center text-gray-950 uppercase tracking-tight mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        Fahrzeug anfragen
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8 text-[15px]">
        {/* Selection box */}
        <div className="bg-[#f5f5f5] p-8 flex flex-col md:flex-row md:items-center gap-6 border border-[#E0E0E0]">
          <span className="font-bold text-gray-800 md:w-1/3">
            Bitte wählen Sie eine der folgenden Optionen, um den nächsten Schritt zu machen:
          </span>
          <div className="flex items-center gap-8 flex-1">
            <label className="flex items-center gap-3 font-bold text-gray-900 cursor-pointer">
              <input 
                type="radio" 
                name="formType" 
                checked={formType === 'anfrage'} 
                onChange={() => setFormType('anfrage')}
                className="w-5 h-5 text-[#009FE3] border-gray-300 focus:ring-[#009FE3]"
              />
              <span>Fahrzeuganfrage</span>
            </label>
            <label className="flex items-center gap-3 font-bold text-gray-900 cursor-pointer">
              <input 
                type="radio" 
                name="formType" 
                checked={formType === 'probefahrt'} 
                onChange={() => setFormType('probefahrt')}
                className="w-5 h-5 text-[#009FE3] border-gray-300 focus:ring-[#009FE3]"
              />
              <span>Probefahrt</span>
            </label>
          </div>
        </div>

        <div className="text-[12px] text-gray-500 font-bold mb-2">*Pflichtfelder bitte ausfüllen</div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-900">Anrede</label>
            <select 
              value={formData.anrede}
              onChange={(e) => setFormData({...formData, anrede: e.target.value})}
              className="w-full bg-[#fcfcfc] border border-[#CCCCCC] px-4 py-3 focus:ring-[#009FE3] focus:border-[#009FE3] text-gray-800 font-medium"
            >
              <option value="">--</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
              <option value="Divers">Divers</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-900">Vorname*</label>
            <input 
              type="text" 
              required
              value={formData.vorname}
              onChange={(e) => setFormData({...formData, vorname: e.target.value})}
              className="w-full bg-[#fcfcfc] border border-[#CCCCCC] px-4 py-3 focus:ring-[#009FE3] focus:border-[#009FE3] text-gray-800 font-medium" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-900">Nachname*</label>
            <input 
              type="text" 
              required
              value={formData.nachname}
              onChange={(e) => setFormData({...formData, nachname: e.target.value})}
              className="w-full bg-[#fcfcfc] border border-[#CCCCCC] px-4 py-3 focus:ring-[#009FE3] focus:border-[#009FE3] text-gray-800 font-medium" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-900">E-Mail *</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-[#fcfcfc] border border-[#CCCCCC] px-4 py-3 focus:ring-[#009FE3] focus:border-[#009FE3] text-gray-800 font-medium" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-900">Telefon</label>
            <input 
              type="tel" 
              value={formData.telefon}
              onChange={(e) => setFormData({...formData, telefon: e.target.value})}
              className="w-full bg-[#fcfcfc] border border-[#CCCCCC] px-4 py-3 focus:ring-[#009FE3] focus:border-[#009FE3] text-gray-800 font-medium" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-900">Firma</label>
            <input 
              type="text" 
              value={formData.firma}
              onChange={(e) => setFormData({...formData, firma: e.target.value})}
              className="w-full bg-[#fcfcfc] border border-[#CCCCCC] px-4 py-3 focus:ring-[#009FE3] focus:border-[#009FE3] text-gray-800 font-medium" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-900">Ihre Nachricht*</label>
          <textarea 
            required
            rows={5}
            value={formData.nachricht}
            onChange={(e) => setFormData({...formData, nachricht: e.target.value})}
            className="w-full bg-[#fcfcfc] border border-[#CCCCCC] px-4 py-3 focus:ring-[#009FE3] focus:border-[#009FE3] text-gray-800 font-medium resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="bg-[#009FE3] hover:bg-[#008ac7] text-white text-[16px] font-bold py-3.5 px-10 rounded-[30px] transition-all shadow-sm"
          >
            Absenden
          </button>
        </div>
      </form>
    </div>
  );
}
