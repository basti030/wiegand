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
import VehicleActions from "@/components/vehicle/VehicleActions";
import { formatTechSpecs, getCO2Color } from "@/lib/vehicle-utils";
import VehicleGallery from "@/components/vehicle/VehicleGallery";
import VehicleInquiryForm from "@/components/vehicle/VehicleInquiryForm";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('*')
    .eq('external_id', id)
    .single();

  if (!vehicle) return { title: "Fahrzeug nicht gefunden | Autohaus Wiegand" };

  const ad = (vehicle.raw_data as any) || {};
  const price = vehicle.price || "Auf Anfrage";
  const power = ad.power ? `${Math.round(ad.power * 1.36)} PS` : "";
  const fuel = ad.fuel === 'ELECTRICITY' ? 'Elektro' : ad.fuel === 'PETROL' ? 'Benzin' : ad.fuel || "";

  return {
    title: `${vehicle.title} | Autohaus Wiegand`,
    description: `Jetzt den ${vehicle.title} (${power}, ${fuel}) für ${price} bei Autohaus Wiegand entdecken. Top-Ausstattung, sofort verfügbar in Büdingen oder Gelnhausen.`,
  };
}

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
  let { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('external_id', id)
    .maybeSingle();
    
  if (!vehicle) {
    const { data: vById } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    vehicle = vById;
  }

  if (!vehicle) {
    notFound();
  }

  const ad = (vehicle.raw_data as any) || {};
  const cloudImages = Array.isArray(ad.cloud_images) ? ad.cloud_images.filter(Boolean) : [];
  let galleryImages = cloudImages.length > 0 ? cloudImages : [vehicle.image].filter(Boolean);
  
  // Fallback if no images at all
  if (galleryImages.length === 0) {
    galleryImages = ['/images/betrieb.jpg']; // Use an existing image as placeholder
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
  
  const isSkoda = vehicle.brand?.toLowerCase().includes('skoda');
  const isGelnhausen = isSkoda || 
    ad.location?.toLowerCase().includes('gelnhausen') || 
    ad.dealer?.toLowerCase().includes('gelnhausen') || 
    ad.seller?.toLowerCase().includes('gelnhausen');
    
  const standortPhone = isGelnhausen ? "+49605192150" : "+49604296450";
  const standortPhoneDisplay = isGelnhausen ? "+49 6051 9215-0" : "+49 6042 9645-0";

  return (
    <div className="bg-white min-h-screen pb-24" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {/* Breadcrumbs */}
      <div className="bg-[#f5f5f5] py-3">
        <div className="container mx-auto px-4 text-[13px] text-gray-600 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:underline">Startseite</Link>
          <span>/</span>
          <Link href="/fahrzeuge" className="hover:underline">Angebote</Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold truncate">{vehicle.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10 max-w-[1500px]">
        <VehicleActions externalId={vehicle.external_id || vehicle.id} />

        {/* Title & Subtitle above Grid */}
        <div className="mb-10">
          <h1 className="text-[36px] md:text-[54px] font-extrabold text-gray-900 leading-tight tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {vehicle.brand} {vehicle.title?.replace(vehicle.brand || '', '').trim()}
          </h1>
          <p className="text-[20px] md:text-[26px] text-[#212121] font-bold mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {ad.modelDescription || 'Attraktives Angebot'}
          </p>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-4 py-1 bg-white border border-[#CCCCCC] text-[14px] font-bold uppercase rounded-full text-gray-700">
              NR: {ad.external_id || vehicle.id.substring(0, 6)}
            </span>
            <span className="px-4 py-1 bg-white border border-[#CCCCCC] text-[14px] font-bold uppercase rounded-full text-gray-700">
              {ad.condition === 'NEW' ? 'Neuwagen' : 'Gebrauchtwagen'}
            </span>
            <span className="px-4 py-1 bg-white border border-[#CCCCCC] text-[14px] font-bold uppercase rounded-full text-gray-700">
              Sofort lieferbar
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
          
          {/* LEFT COLUMN: Gallery & Technical Elements (66%) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Image Gallery */}
            <div className="bg-white">
              <VehicleGallery 
                images={galleryImages} 
                title={vehicle.title} 
                brand={vehicle.brand} 
              />
            </div>

            {/* Fahrzeugdetails (Visual Specs block) */}
            <div>
              <h2 className="text-[26px] font-extrabold text-black border-t-2 border-[#156089] pt-4 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Fahrzeugdetails
              </h2>
              
              {/* Icon Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
                {[
                  { label: "Erstzulassung", value: ad.firstRegistration ? `${ad.firstRegistration.toString().substring(4)}/${ad.firstRegistration.toString().substring(0, 4)}` : "neu", icon: <Calendar size={32} className="text-[#A0A0A0]" /> },
                  { label: "Kilometerstand", value: `${new Intl.NumberFormat('de-DE').format(ad.mileage || 0)} km`, icon: <Gauge size={32} className="text-[#A0A0A0]" /> },
                  { label: "Getriebe", value: ad.gearbox === 'AUTOMATIC_GEAR' ? 'AUTOMATIC' : 'SCHALTUNG', icon: <ShieldCheck size={32} className="text-[#A0A0A0]" /> },
                  { label: "Kraftstoff", value: ad.fuel === 'ELECTRICITY' ? 'Elektro' : ad.fuel === 'PETROL' ? 'Benzin' : ad.fuel || "Diesel", icon: <Fuel size={32} className="text-[#A0A0A0]" /> },
                  { label: "Leistung", value: ad.power ? `${ad.power} kW (${Math.round(ad.power * 1.36)} PS)` : 'k.A.', icon: <Gauge size={32} className="text-[#A0A0A0]" /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#f5f5f5] p-5 flex items-start gap-3 min-h-[100px]">
                    <div className="mt-1">{stat.icon}</div>
                    <div>
                      <span className="text-[12px] text-gray-500 block font-semibold uppercase">{stat.label}</span>
                      <span className="text-[16px] font-black text-gray-900 block mt-1">{stat.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Technical Table list in gray rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[15px]">
                {[
                  { label: "Fahrzeugnummer", value: vehicle.external_id || vehicle.id },
                  { label: "Farbe", value: vehicle.color || ad.color || 'k.A.' },
                  { label: "Hubraum", value: vehicle.cubic_capacity ? `${vehicle.cubic_capacity} cm³` : ad.cubicCapacity ? `${ad.cubicCapacity} cm³` : 'k.A.' },
                  { label: "Karosserieform", value: vehicle.body_type || ad.bodyType || 'k.A.' },
                  { label: "Innenausstattung", value: ad.interiorFeature || ad.upholstery || 'k.A.' },
                  { label: "HSN | TSN", value: ad.hsn_tsn || ad.hsnTsn || 'k.A.' },
                  { label: "Standort", value: ad.location || 'Autohaus Wiegand' }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-[#f5f5f5] font-medium">
                    <span className="text-gray-500">{stat.label}</span>
                    <span className="text-black font-extrabold text-right">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-[26px] font-extrabold text-black border-t-2 border-[#156089] pt-4 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Extras / Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-[15px] text-gray-800">
                {(Array.isArray(ad.highlights) ? ad.highlights : Array.isArray(ad.highlights?.value) ? ad.highlights.value : ["LED-Scheinwerfer", "Navigationssystem", "Sitzheizung", "Einparkhilfe", "Abstandstempomat"]).map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 py-1 border-b border-[#EEEEEE]">
                    <span className="w-1.5 h-1.5 bg-[#009FE3] rounded-full shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emissionsinfo und Kosten block */}
            <div>
              <h2 className="text-[26px] font-extrabold text-black border-t-2 border-[#156089] pt-4 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Emissionsinfo und Kosten
              </h2>
              
              {/* WLTP Breakdown Table */}
              <div className="overflow-x-auto mb-8 border border-[#EEEEEE]">
                <table className="w-full text-left border-collapse text-[15px]">
                  <thead>
                    <tr className="bg-[#f5f5f5] text-gray-700 font-bold border-b border-[#EEEEEE]">
                      <th className="p-4">WLTP</th>
                      <th className="p-4">Verbrauch l/100km</th>
                      <th className="p-4">CO₂ Emissionen g/km</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEEEEE] text-gray-800 font-medium">
                    <tr>
                      <td className="p-4 font-bold">Kombiniert:</td>
                      <td className="p-4 font-bold">{tech.consumption?.replace(' l/100km','').replace(' kWh/100km','') || 'k.A.'}</td>
                      <td className="p-4 font-bold">{tech.co2?.replace(' g/km','') || 'k.A.'}</td>
                    </tr>
                    <tr>
                      <td className="p-4">Innenstadt:</td>
                      <td className="p-4">{ad.wltp?.consumptionFuelUrban || ad.wltp?.consumptionPowerUrban || '-'}</td>
                      <td className="p-4">{ad.wltp?.co2EmissionUrban || '-'}</td>
                    </tr>
                    <tr>
                      <td className="p-4">Stadtrand:</td>
                      <td className="p-4">{ad.wltp?.consumptionFuelSubUrban || ad.wltp?.consumptionPowerSubUrban || '-'}</td>
                      <td className="p-4">{ad.wltp?.co2EmissionSubUrban || '-'}</td>
                    </tr>
                    <tr>
                      <td className="p-4">Landstraße:</td>
                      <td className="p-4">{ad.wltp?.consumptionFuelExtraUrban || ad.wltp?.consumptionPowerExtraUrban || '-'}</td>
                      <td className="p-4">{ad.wltp?.co2EmissionExtraUrban || '-'}</td>
                    </tr>
                    <tr>
                      <td className="p-4">Autobahn:</td>
                      <td className="p-4">{ad.wltp?.consumptionFuelHighway || ad.wltp?.consumptionPowerHighway || '-'}</td>
                      <td className="p-4">{ad.wltp?.co2EmissionHighway || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Efficiency Arrow Display below WLTP */}
              <div className="mb-10">
                <div className="text-[15px] font-bold text-black mb-4 uppercase">
                  CO₂-Klasse: {tech.co2Class || 'k.A.'}
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="flex flex-col gap-0.5 w-[140px]">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter) => (
                      <div key={letter} className={`h-6 flex items-center text-white text-xs font-extrabold px-2 ${getCO2Color(letter)}`} style={{ clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)' }}>
                        {letter}
                      </div>
                    ))}
                  </div>
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(tech.co2Class) && (
                    <div className="absolute left-[120px] flex items-center" style={{ top: `${['A', 'B', 'C', 'D', 'E', 'F', 'G'].indexOf(tech.co2Class) * 26}px` }}>
                      <span className="text-gray-800 text-[24px] leading-none">◀</span>
                      <span className="bg-black text-white font-black text-[14px] px-3 py-1 rounded">{tech.co2Class}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cost breakdown table */}
              <div className="overflow-x-auto border border-[#EEEEEE]">
                <table className="w-full text-left border-collapse text-[15px]">
                  <thead>
                    <tr className="bg-[#f5f5f5] text-gray-700 font-bold border-b border-[#EEEEEE]">
                      <th colSpan={2} className="p-4">Emissionsinfo und Kosten</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEEEEE] text-gray-800 font-medium">
                    {[
                      { label: "Schadstoffklasse:", value: ad.euro_norm || ad.euroNorm || "-" },
                      { label: "Umweltplakette:", value: ad.environmentalBadge || "-" },
                      { label: "CO2 Kosten (mittel):", desc: "Kosten Durchschnitt 10 Jahre", value: ad.co2CostAverage || ad.co2_cost_average || "-" },
                      { label: "CO2 Kosten (niedrig):", desc: "Kosten Durchschnitt 10 Jahre", value: ad.co2CostLow || ad.co2_cost_low || "-" },
                      { label: "CO2 Kosten (hoch):", desc: "Kosten Durchschnitt 10 Jahre", value: ad.co2CostHigh || ad.co2_cost_high || "-" },
                      { label: "Energiekosten bei 15.000 km pro Jahr:", value: ad.energyCost || ad.energy_cost || "-" },
                      { label: "Jahressteuer:", value: ad.annualTax || ad.annual_tax || "-" },
                      { label: "DAT Leitfaden:", value: ad.datLeitfaden || "https://www.dat.de/co2" }
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="p-4 py-3 flex flex-col">
                          <span className="font-bold">{row.label}</span>
                          {row.desc && <span className="text-[12px] text-gray-500 font-normal">{row.desc}</span>}
                        </td>
                        <td className="p-4 py-3 text-right font-bold text-black">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Standort block */}
            <div>
              <h2 className="text-[26px] font-extrabold text-black border-t-2 border-[#156089] pt-4 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Standort
              </h2>
              {(() => {
                const isSkoda = vehicle.brand?.toLowerCase().includes('skoda');
                const isGelnhausen = isSkoda || 
                  ad.location?.toLowerCase().includes('gelnhausen') || 
                  ad.dealer?.toLowerCase().includes('gelnhausen') || 
                  ad.seller?.toLowerCase().includes('gelnhausen');
                  
                const standort = isGelnhausen ? {
                  name: "Autohaus Wiegand Gelnhausen",
                  address: "Lützelhäuser Weg 6",
                  city: "63571 Gelnhausen",
                  image: "https://images.unsplash.com/photo-1610642372651-fe6e7bc209ef?auto=format&fit=crop&w=600&q=80"
                } : {
                  name: "Autohaus Wiegand Büdingen",
                  address: "Industriestraße 10",
                  city: "63654 Büdingen",
                  image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80"
                };

                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 bg-[#f5f5f5] overflow-hidden">
                    <div className="md:col-span-5 relative min-h-[200px]">
                      <img 
                        src={standort.image} 
                        alt={standort.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:col-span-7 p-8 flex flex-col justify-center">
                      <div className="text-[18px] font-extrabold text-gray-900 mb-2">
                        {standort.name}
                      </div>
                      <div className="text-[15px] text-gray-600 leading-relaxed mb-6">
                        {standort.address}<br />
                        {standort.city}
                      </div>
                      <div>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(standort.name + ' ' + standort.address + ' ' + standort.city)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 bg-[#404040] hover:bg-black text-white font-bold px-6 py-3 rounded-full text-[15px] transition-all shadow-sm"
                        >
                          <MapPin size={18} />
                          <span>Route berechnen</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Sidebar with Action-Driven conversion (33%) */}
          <div className="lg:col-span-4 h-full relative">
            <div className="sticky top-24 border border-[#EEEEEE] p-6 bg-white space-y-6 shadow-md rounded-none">
              {/* Pricing Box */}
              <div>
                {(() => {
                  const rawPrice = vehicle.price && typeof vehicle.price === 'string' 
                    ? parseFloat(vehicle.price.replace(/[^0-9,-]/g, '').replace(',', '.')) 
                    : 0;

                  if (rawPrice <= 0) return null;

                  const hasFinancing = !!ad.financing;
                  
                  // Extract digits from payback period e.g. MONTHS_36 -> 36
                  const extractTerm = (period: any) => {
                    if (typeof period === 'number') return period;
                    if (typeof period === 'string') {
                      const match = period.match(/\d+/);
                      return match ? parseInt(match[0]) : 36;
                    }
                    return 36;
                  };

                  const parseCurrency = (val: any) => {
                    if (typeof val === 'number') return val;
                    if (typeof val === 'string') {
                      return parseFloat(val.replace(/[^0-9.,-]/g, '').replace(',', '.'));
                    }
                    return 0;
                  };

                  const finData = ad.financing ? {
                    monthlyRate: parseCurrency(ad.financing.monthlyInstallment), 
                    term: extractTerm(ad.financing.paybackPeriod),
                    downPayment: parseCurrency(ad.financing.firstInstallment),
                    balloonRate: parseCurrency(ad.financing.balloonInstallment || 0),
                    uvp: parseCurrency(ad.financing.grossTotalPrice),
                    effectiveInterest: parseCurrency(ad.financing.annualPercentageRate || 4.99),
                    nominalInterest: parseCurrency(ad.financing.nominalInterestRate || 4.88),
                    netLoanAmount: parseCurrency(ad.financing.netLoanAmount),
                    totalMileage: extractTerm(ad.financing.annualMileage),
                    totalAmount: parseCurrency(ad.financing.grossTotalAmount),
                    lender: ad.financing.bank || "Volkswagen Bank, Gifhorner Straße 57, 38112 Braunschweig"
                  } : {
                    monthlyRate: Math.round(rawPrice * 0.0064), 
                    term: 36,
                    downPayment: Math.round(rawPrice * 0.20),
                    balloonRate: Math.round(rawPrice * 0.68),
                    uvp: Math.round(rawPrice * 1.32),
                    effectiveInterest: 4.99,
                    nominalInterest: 4.88,
                    netLoanAmount: Math.round(rawPrice * 0.80),
                    totalMileage: 9999,
                    totalAmount: Math.round(rawPrice * 0.907),
                    lender: "Volkswagen Bank, Gifhorner Straße 57, 38112 Braunschweig"
                  };

                  return (
                    <div className="space-y-6">
                      {/* Finanzierungsrate */}
                      {hasFinancing && (
                        <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#009FE3] flex items-center justify-center text-white font-black text-[24px]">
                              ^
                            </div>
                            <div>
                              <div className="text-[16px] font-extrabold text-[#212121] flex items-center gap-1">
                                Finanzierungsrate
                              </div>
                              <div className="text-[12px] text-gray-500 font-bold">
                                Monatliche Rate
                              </div>
                            </div>
                          </div>
                          <div className="text-[34px] font-black text-gray-900 tracking-tighter leading-none">
                            {finData.monthlyRate},- €
                          </div>
                        </div>
                      )}

                      {/* Unser Preis */}
                      <div className="flex items-start gap-4">
                        <div className="text-[#009FE3] mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                            <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                            <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v14.25c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 19.125V4.875ZM11.25 12a2.25 2.25 0 0 0 3.182 2.033c.313-.141.684-.023.878.272l.615.924a.75.75 0 0 1-.828 1.112c-.24-.057-.488-.086-.74-.086a5.25 5.25 0 1 1 2.953-9.619.75.75 0 0 1-.26 1.467c-.297-.053-.6-.081-.908-.081a3.75 3.75 0 0 0-3.75 3.75v.25Z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 text-right">
                          <div className="text-[16px] font-extrabold text-[#212121] uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            Unser Preis:
                          </div>
                          <div className="text-[34px] font-black text-gray-900 tracking-tighter leading-none mt-1">
                            {vehicle.price}
                          </div>
                          <div className="text-[12px] text-gray-500 mt-2 font-medium">
                            inkl. 19 % MwSt., Netto: {vehicle.price && typeof vehicle.price === 'string' ? `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(vehicle.price.replace(/[^0-9,-]/g, '').replace(',', '.')) / 1.19)}` : 'Auf Anfrage'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Primary CTA buttons matching Cyan layout */}
              <div className="space-y-3 pt-4 border-t border-[#EEEEEE]">
                <a 
                  href="#anfrage-form" 
                  className="w-full bg-[#009FE3] hover:bg-[#008ac7] text-white text-[18px] font-bold py-3.5 px-6 rounded-[30px] flex items-center justify-between transition-all shadow-sm"
                >
                  <span>Fahrzeuganfrage</span>
                  <span className="text-[22px] font-normal leading-none">&gt;</span>
                </a>
                <a 
                  href={`tel:${standortPhone}`} 
                  className="w-full bg-[#009FE3] hover:bg-[#008ac7] text-white text-[18px] font-bold py-3.5 px-6 rounded-[30px] flex items-center justify-between transition-all shadow-sm"
                >
                  <span>{standortPhoneDisplay}</span>
                  <span className="text-[22px] font-normal leading-none">&gt;</span>
                </a>
                <a 
                  href="#anfrage-form" 
                  className="w-full bg-[#009FE3] hover:bg-[#008ac7] text-white text-[18px] font-bold py-3.5 px-6 rounded-[30px] flex items-center justify-between transition-all shadow-sm"
                >
                  <span>Probefahrtanfrage</span>
                  <span className="text-[22px] font-normal leading-none">&gt;</span>
                </a>
              </div>

              {/* Efficiency Class Pointer Arrow Section */}
              <div className="pt-6 border-t border-[#EEEEEE] text-[14px]">
                <div className="flex items-center justify-between mb-4 font-medium text-gray-700">
                  <div className="space-y-1">
                    <div>Verbrauch komb.: <span className="font-bold">{tech.consumption}</span></div>
                    <div>CO₂-Emissionen komb.: <span className="font-bold">{tech.co2}</span></div>
                    <div>CO₂ Klasse: <span className="font-bold uppercase">{tech.co2Class || 'D'}</span></div>
                  </div>
                </div>

                {/* A-G pointer arrow */}
                <div className="relative flex items-start gap-4">
                  <div className="flex flex-col gap-0.5 w-[140px]">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter) => (
                      <div key={letter} className={`h-6 flex items-center text-white text-xs font-extrabold px-2 ${getCO2Color(letter)}`} style={{ clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)' }}>
                        {letter}
                      </div>
                    ))}
                  </div>
                  {/* Pointer */}
                  <div className="absolute left-[120px] flex items-center" style={{ top: `${['A', 'B', 'C', 'D', 'E', 'F', 'G'].indexOf(tech.co2Class || 'D') * 26}px` }}>
                    <span className="text-gray-800 text-[24px] leading-none">◀</span>
                    <span className="bg-black text-white font-black text-[14px] px-3 py-1 rounded">{tech.co2Class || 'D'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Leasing und Finanzierungsrechner */}
        {(() => {
          const rawPrice = vehicle.price && typeof vehicle.price === 'string' 
            ? parseFloat(vehicle.price.replace(/[^0-9,-]/g, '').replace(',', '.')) 
            : 0;

          if (rawPrice <= 0) return null;
          if (!ad.financing) return null;

          // Extract digits from payback period e.g. MONTHS_36 -> 36
          const extractTerm = (period: any) => {
            if (typeof period === 'number') return period;
            if (typeof period === 'string') {
              const match = period.match(/\d+/);
              return match ? parseInt(match[0]) : 36;
            }
            return 36;
          };

          const parseCurrency = (val: any) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
              return parseFloat(val.replace(/[^0-9.,-]/g, '').replace(',', '.'));
            }
            return 0;
          };

          const finData = {
            monthlyRate: parseCurrency(ad.financing.monthlyInstallment), 
            term: extractTerm(ad.financing.paybackPeriod),
            downPayment: parseCurrency(ad.financing.firstInstallment),
            balloonRate: parseCurrency(ad.financing.balloonInstallment || 0),
            uvp: parseCurrency(ad.financing.grossTotalPrice),
            effectiveInterest: parseCurrency(ad.financing.annualPercentageRate || 4.99),
            nominalInterest: parseCurrency(ad.financing.nominalInterestRate || 4.88),
            netLoanAmount: parseCurrency(ad.financing.netLoanAmount),
            totalMileage: extractTerm(ad.financing.annualMileage),
            totalAmount: parseCurrency(ad.financing.grossTotalAmount),
            lender: ad.financing.bank || "Volkswagen Bank, Gifhorner Straße 57, 38112 Braunschweig"
          };

          return (
            <div className="mt-16 border-t-2 border-[#156089] pt-12 max-w-[1200px] mx-auto">
              <h2 className="text-[32px] font-black text-center text-gray-950 uppercase tracking-tight mb-12" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Leasing und Finanzierungsrechner
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-[15px] font-medium text-gray-700">
                {/* Column 1: Konditionen */}
                <div>
                  <h3 className="text-[#009FE3] font-extrabold text-[18px] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Konditionen
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div className="flex items-center gap-1">Monatliche Rate:</div>
                      <div className="font-black text-gray-950 text-[16px]">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(finData.monthlyRate || 0))}</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div>Laufzeit:</div>
                      <div className="text-gray-900 font-bold">{finData.term || 36} Monate</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div className="flex items-center gap-1">Anzahlung:</div>
                      <div className="text-gray-900 font-bold">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(finData.downPayment || 0))}</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div>Schluss-/Ballonrate:</div>
                      <div className="text-gray-900 font-bold">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(finData.balloonRate)}</div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Allgemeine Daten */}
                <div>
                  <h3 className="text-[#009FE3] font-extrabold text-[18px] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Allgemeine Daten
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div>UVP:</div>
                      <div className="text-gray-900 font-bold">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(finData.uvp)}</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div>Kaufpreis:</div>
                      <div className="text-gray-900 font-bold">{vehicle.price}</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div>Finanzierungsbetrag:</div>
                      <div className="text-gray-900 font-bold">0,- €</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div>Erste Rate:</div>
                      <div className="text-gray-900 font-bold">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(finData.monthlyRate)}</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div>Gesamtbetrag:</div>
                      <div className="text-gray-900 font-bold">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(finData.totalAmount)}</div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Weitere Informationen */}
                <div>
                  <h3 className="text-[#009FE3] font-extrabold text-[18px] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Weitere Informationen
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div className="flex items-center gap-1">Effektiver Jahreszins:</div>
                      <div className="text-gray-900 font-bold">{(Number(finData.effectiveInterest || 4.99)).toFixed(2).replace('.', ',')} %</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div>Sollzins gebunden p.a.:</div>
                      <div className="text-gray-900 font-bold">{(Number(finData.nominalInterest || 4.88)).toFixed(2).replace('.', ',')} %</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div className="flex items-center gap-1">Nettodarlehensbetrag:</div>
                      <div className="text-gray-900 font-bold">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(finData.netLoanAmount)}</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-2">
                      <div>Gesamtfahrleistung:</div>
                      <div className="text-gray-900 font-bold">{new Intl.NumberFormat('de-DE').format(finData.totalMileage)} Km</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Darlehensbedingungen */}
              <div className="mt-8 text-[12px] text-gray-500 leading-relaxed">
                <div className="text-gray-800 font-bold mb-1 text-[14px]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Darlehensbedingungen</div>
                Finanzierungsangebot inkl. 19% MwSt. Ein unverbindliches Angebot der {finData.lender}. Irrtümer vorbehalten.
              </div>
            </div>
          );
        })()}

        {/* Vehicle Inquiry Form */}
        <VehicleInquiryForm 
          vehicleTitle={`${vehicle.brand} ${vehicle.title}`} 
          vehicleId={vehicle.external_id || vehicle.id} 
        />

      </div>
    </div>
  );
}
