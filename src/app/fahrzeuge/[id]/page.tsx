import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, 
  Calendar, 
  Gauge, 
  Fuel, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  ChevronRight, 
  Check, 
  Leaf, 
  Zap, 
  Droplets,
  History,
  Info,
  CreditCard,
  Percent,
  Banknote,
  Navigation
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatTechSpecs, getCO2Color } from "@/lib/vehicle-utils";
import VehicleGallery from "@/components/vehicle/VehicleGallery";

interface DescriptionSection {
  title: string;
  items: string[];
}

function parseDescription(text: string): DescriptionSection[] {
  if (!text) return [];

  // 1. Clean up weird double backslashes and excessive stars
  const cleanText = text.replace(/\\\\/g, '\n').replace(/\\\*/g, '*');
  
  // 2. Split by category headers like **Category:**
  // We look for patterns like **Title:** or \n**Title:**
  const parts = cleanText.split(/\*\*([^*]+)\:\*\*/);
  
  const sections: DescriptionSection[] = [];
  
  // The first part might be lead-in text (e.g. Fahrzeug-Nr)
  if (parts[0].trim()) {
    sections.push({
      title: "Allgemein",
      items: parts[0].split('*').map(i => i.trim()).filter(Boolean)
    });
  }

  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i].trim();
    const content = parts[i + 1] || "";
    
    // Split content by '*' or '\n' or ','
    const items = content
      .split(/[*|\n]/)
      .map(item => item.trim().replace(/^[\\*]+|[\\*]+$/g, ''))
      .filter(item => item.length > 2); // Avoid tiny fragments

    if (items.length > 0) {
      sections.push({ title, items });
    }
  }

  return sections;
}

export default async function VehicleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('external_id', id)
    .single();

  if (error || !vehicle) {
    notFound();
  }

  const ad = (vehicle.raw_data as any) || {};
  const cloudImages = Array.isArray(ad.cloud_images) ? ad.cloud_images.filter(Boolean) : [];
  let galleryImages = cloudImages.length > 0 ? cloudImages : [vehicle.image].filter(Boolean);
  
  // Fallback if no images at all
  if (galleryImages.length === 0) {
    galleryImages = ['/images/skoda-ocatvia.jpg']; // Use an existing image as placeholder
  }

  const specs = [
    { icon: <Calendar size={22} />, label: "Kilometerstand", value: `${new Intl.NumberFormat('de-DE').format(ad.mileage || 0)} km` },
    { icon: <Gauge size={22} />, label: "Erstzulassung", value: ad.firstRegistration ? `${ad.firstRegistration.toString().substring(4)}/${ad.firstRegistration.toString().substring(0, 4)}` : "EZ 2024" },
    { icon: <Fuel size={22} />, label: "Kraftstoff", value: ad.fuel === 'ELECTRICITY' ? 'Elektro' : ad.fuel === 'PETROL' ? 'Benzin' : ad.fuel || "k.A." },
    { icon: <ShieldCheck size={22} />, label: "Getriebe", value: ad.gearbox === 'AUTOMATIC_GEAR' ? 'Automatik' : 'Schaltung' },
  ];

  const tech = formatTechSpecs(ad);
  const fin = ad.financing;
  const descriptionSections = parseDescription(ad.description || "");

  return (
    <div className="bg-[#f8f9fb] min-h-screen pb-24">
      {/* Detail Header / Nav */}
      <div className="bg-white py-6 border-b border-gray-100">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/fahrzeuge" className="flex items-center gap-2 text-gray-400 hover:text-brand-orange transition-colors font-black uppercase tracking-widest text-[10px]">
            <ArrowLeft size={16} /> Zurück
          </Link>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link> 
            <ChevronRight size={12} /> 
            <Link href="/fahrzeuge" className="hover:text-brand-dark transition-colors">Bestand</Link> 
            <ChevronRight size={12} /> 
            <span className="text-brand-dark">{vehicle.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-4 py-1.5 bg-brand-orange text-white text-[11px] font-black uppercase tracking-tighter rounded-lg shadow-lg shadow-brand-orange/20">
              {ad.condition === 'NEW' ? 'Neufahrzeug' : 'Gebrauchtfahrzeug'}
            </span>
            <span className="px-4 py-1.5 bg-brand-dark text-white text-[11px] font-black uppercase tracking-tighter rounded-lg">
              Sofort Verfügbar
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-brand-dark uppercase tracking-tighter leading-[0.8] mb-6">
            {vehicle.title}
          </h1>
          <div className="text-2xl text-gray-400 font-bold uppercase tracking-tight flex items-center flex-wrap gap-x-4 max-w-4xl">
            {ad.modelDescription ? (
              <span>{ad.modelDescription}</span>
            ) : (
              <>
                {ad.model && <span>{ad.model}</span>}
                <span className="w-2 h-2 bg-gray-200 rounded-full"></span>
                <span>{ad.gearbox === 'AUTOMATIC_GEAR' ? 'Automatik' : 'Schaltung'}</span>
                <span className="w-2 h-2 bg-gray-200 rounded-full"></span>
                <span>{ad.power} kW ({Math.round(ad.power * 1.36)} PS)</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: CONTENT (9 Columns for Massive Image) */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* Interactive Premium Gallery */}
            <div className="-mx-4 md:mx-0">
              <VehicleGallery 
                images={galleryImages} 
                title={vehicle.title} 
                brand={vehicle.brand} 
              />
            </div>

            {/* Modern Tech Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {specs.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-brand-orange mb-4 p-3 bg-brand-orange/5 rounded-2xl w-fit">{stat.icon}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</div>
                  <div className="text-base font-black text-brand-dark">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Description Section */}
            {descriptionSections.length > 0 && (
              <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-brand-dark rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <History size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Fahrzeugbeschreibung</h3>
                </div>

                <div className="space-y-8">
                  {descriptionSections.map((section, idx) => (
                    <div key={idx} className="group">
                      <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 group-hover:text-brand-orange transition-colors">
                        <span className="w-6 h-px bg-gray-100"></span>
                        {section.title}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-8">
                        {section.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="min-w-[3px] h-[3px] bg-brand-orange/40 rounded-full mt-[0.6rem]"></div>
                            <span className="text-[13px] font-bold text-gray-600 leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* highlights code continues below... */}
            <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-orange/20">
                  <Check size={24} />
                </div>
                <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Top-Ausstattung</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Array.isArray(ad.highlights) ? ad.highlights : Array.isArray(ad.highlights?.value) ? ad.highlights.value : ["LED-Scheinwerfer", "Navigationssystem", "Abstandstempomat", "Sitzheizung", "Einparkhilfe", "Spurhalteassistent"]).slice(0, 12).map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-brand-orange/5 border border-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all">
                      <Check size={12} />
                    </div>
                    <span className="text-sm font-bold text-gray-600 group-hover:text-brand-dark transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leasing / Financing Section */}
            {fin && (
              <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-sm border border-gray-100 overflow-hidden relative">
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-dark rounded-2xl flex items-center justify-center text-brand-orange shadow-lg">
                      <Percent size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Finanzierung & Leasing</h3>
                  </div>
                  <div className="px-4 py-2 bg-brand-gray/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-dark border border-gray-100">
                    {fin.typeOfFinancing === 'leasing' ? 'Leasing-Angebot' : 'Finanzierung'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Monatlich</div>
                    <div className="text-3xl font-black text-brand-orange">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(fin.monthlyInstallment)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Laufzeit</div>
                    <div className="text-2xl font-black text-brand-dark">{fin.paybackPeriod?.replace('MONTHS_', '') || '36'} Monate</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sonderzahlung</div>
                    <div className="text-2xl font-black text-brand-dark">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(fin.firstInstallment || 0)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">KM / Jahr</div>
                    <div className="text-2xl font-black text-brand-dark">{new Intl.NumberFormat('de-DE').format(fin.annualMileage || 10000)} km</div>
                  </div>
                </div>

                <div className="p-8 bg-brand-gray/30 rounded-[2rem] border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-bold text-gray-600">
                    <div className="flex flex-col gap-2">
                       <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                         <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black">Nettodarlehen</span>
                         <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(fin.netLoanAmount)}</span>
                       </div>
                       <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                         <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black">Gesamtbetrag</span>
                         <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(fin.grossTotalAmount)}</span>
                       </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-2">Darlehnsgeber</div>
                      <p className="text-[10px] leading-relaxed text-gray-500 uppercase">{fin.bank}</p>
                    </div>
                  </div>
                </div>

                {/* Variants Preview */}
                {fin.additionalLeasingVariants?.value?.length > 0 && (
                   <div className="mt-10 pt-10 border-t border-gray-50">
                     <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Alternative Konditionen</div>
                     <div className="flex flex-wrap gap-4">
                       {fin.additionalLeasingVariants.value.slice(0, 4).map((v: any, i: number) => (
                         <div key={i} className="px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-brand-orange transition-colors cursor-pointer group">
                           <div className="text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-brand-orange">
                             {v.paybackPeriod?.replace('MONTHS_', '')} Mo. | {new Intl.NumberFormat('de-DE').format(v.annualMileage)} km
                           </div>
                           <div className="text-lg font-black text-brand-dark">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v.monthlyInstallment)}</div>
                         </div>
                       ))}
                     </div>
                   </div>
                )}
              </div>
            )}

            {/* Efficiency Box */}
            <div className="bg-brand-dark rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-10">
                   <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                     <Leaf className="text-brand-orange" /> Effizienz & Technik
                   </h3>
                   {tech.co2Class !== 'k.A.' && (
                     <div className={`px-5 py-2 ${getCO2Color(tech.co2Class)} text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl`}>
                       Klasse {tech.co2Class}
                     </div>
                   )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                   {[
                     { label: "Verbrauch (kombiniert)", value: tech.consumption, icon: tech.isElectric ? <Zap size={16} /> : <Droplets size={16} /> },
                     { label: "CO2-Emissionen", value: tech.co2, icon: <Leaf size={16} /> },
                     { label: "Leistung", value: ad.power ? `${ad.power} kW (${Math.round(ad.power * 1.36)} PS)` : 'k.A.', icon: <Gauge size={16} /> },
                     { label: "Hubraum", value: ad.cubicCapacity ? `${ad.cubicCapacity} ccm` : 'k.A.', icon: <Info size={16} /> }
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center py-5 border-b border-white/10 group">
                       <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-brand-orange transition-colors">
                         {item.icon} {item.label}
                       </span>
                       <span className="text-sm font-black">{item.value}</span>
                     </div>
                   ))}
                 </div>
                 
                 <p className="mt-10 text-[9px] text-gray-500 font-bold uppercase tracking-widest italic leading-relaxed">
                   * Die angegebenen Werte wurden nach dem WLTP-Messverfahren ermittelt.
                 </p>
               </div>
               {/* Pattern Overlay */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          {/* RIGHT: SIDEBAR (3 Columns - More Compact) */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 space-y-6">
              
              {/* Pricing Card */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 overflow-hidden relative">
                <div className="relative z-10">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Unser Barpreis</div>
                  <div className="text-4xl font-black text-brand-dark mb-1 tracking-tighter">{vehicle.price}</div>
                  <div className="text-[10px] font-bold text-gray-400 mb-8 uppercase tracking-widest border-b border-gray-50 pb-8">Inkl. 19% MwSt.</div>
                  
                  {fin && (
                    <div className="mt-8 mb-10 p-5 bg-brand-orange rounded-3xl text-white shadow-xl shadow-brand-orange/30">
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">Oder Leasing</div>
                      <div className="text-3xl font-black leading-tight">
                        {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(fin.monthlyInstallment)}
                        <span className="text-[10px] opacity-80 ml-1">/ mtl.</span>
                      </div>
                      <div className="text-[8px] font-bold mt-1 opacity-70 uppercase tracking-widest">Ohne Anzahlung | 36 Mo.</div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button className="w-full bg-brand-orange text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-orange/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                       {fin ? 'Leasing anfragen' : 'Finanzierung anfragen'} <ChevronRight size={14} />
                    </button>
                    <button className="w-full bg-brand-gray text-brand-dark py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                      Inzahlungnahme <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-4 p-4 bg-brand-gray/50 rounded-2xl border border-gray-100">
                      <ShieldCheck size={20} className="text-brand-orange" />
                      <div>
                        <div className="text-[8px] font-black uppercase text-gray-400">Garantie</div>
                        <div className="text-[10px] font-bold">Inklusive</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-brand-gray/50 rounded-2xl border border-gray-100">
                      <History size={20} className="text-brand-orange" />
                      <div>
                        <div className="text-[8px] font-black uppercase text-gray-400">Prüfung</div>
                        <div className="text-[10px] font-bold">Zertifiziert</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-brand-dark rounded-[2.5rem] p-8 text-white overflow-hidden relative shadow-2xl">
                <h4 className="text-[11px] font-black uppercase tracking-widest mb-6">Ansprechpartner</h4>
                <div className="flex gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center p-3 border border-white/10">
                    <img src="/images/logo.png" alt="Wiegand" className="w-full h-full object-contain brightness-0 invert" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Wiegand Gruppe</div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Büdingen</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <a href="tel:06041823380" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5 group">
                    <span className="flex items-center gap-2 text-xs font-bold"><Phone size={14} className="text-brand-orange" /> 06041-823380</span>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white" />
                  </a>
                  <a href="mailto:info@auto-wiegand.de" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5 group">
                    <span className="flex items-center gap-2 text-xs font-bold"><Mail size={14} className="text-brand-orange" /> E-Mail</span>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white" />
                  </a>
                  <Link href="/termin" className="flex items-center justify-center gap-2 w-full py-4 bg-brand-orange text-white rounded-xl font-black uppercase tracking-widest text-[9px] mt-3 hover:shadow-lg hover:shadow-brand-orange/20 transition-all">
                    <MessageSquare size={14} /> Termin
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
