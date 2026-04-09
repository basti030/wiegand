"use client";
// Force redeploy trigger 2


import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Car, Settings, Users, Phone, ShieldCheck, Zap, ChevronRight, Percent } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [topVehicle, setTopVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopOffer() {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .limit(5); // Fetch a few to pick a good one
          
        if (data && data.length > 0) {
          // Select one that looks like the mockup (2527391 is perfect)
          const favorite = data.find(v => v.external_id === '2527391') || data[0];
          setTopVehicle(favorite);
        }
      } catch (err) {
        console.error('Failed to fetch top offer:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopOffer();
  }, []);

  const ad = topVehicle?.raw_data || {};
  const fin = ad.financing;
  const router = useRouter();

  // Search States
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedMileage, setSelectedMileage] = useState("");

  useEffect(() => {
    async function fetchFilterData() {
      const { data } = await supabase.from('vehicles').select('brand');
      if (data) {
        const uniqueBrands = [...new Set(data.map(v => v.brand))].filter(Boolean).sort();
        setBrands(uniqueBrands);
      }
    }
    fetchFilterData();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      async function fetchModels() {
        const { data } = await supabase
          .from('vehicles')
          .select('raw_data')
          .eq('brand', selectedBrand);
        if (data) {
          const uniqueModels = [...new Set(data.map(v => (v.raw_data as any).model))].filter(Boolean).sort();
          setModels(uniqueModels);
        }
      }
      fetchModels();
    } else {
      setModels([]);
    }
    setSelectedModel("");
  }, [selectedBrand]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBrand) params.append('brand', selectedBrand);
    if (selectedModel) params.append('model', selectedModel);
    if (selectedPrice) params.append('price', selectedPrice);
    if (selectedMileage) params.append('mileage', selectedMileage);
    
    router.push(`/fahrzeuge?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.jpg" 
            alt="Auto Wiegand Autohaus" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-1 bg-brand-orange"></span>
              <span className="text-white text-xs md:text-sm font-black uppercase tracking-[0.3em]">Willkommen bei Auto Wiegand</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
              DRIVEN BY <br />
              <span className="text-brand-orange">PASSION.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-xl font-medium">
              Erleben Sie die Performance von CUPRA und die Innovation von SEAT & SKODA direkt in Bismark.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <a href="/fahrzeuge" className="btn-primary flex items-center gap-4 text-sm md:text-base px-10 py-5 rounded-none uppercase tracking-widest font-black group">
                Bestand entdecken <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </a>
              <a href="/kontakt" className="bg-white/10 hover:bg-white text-white hover:text-brand-dark px-10 py-5 transition-all flex items-center gap-4 text-sm md:text-base uppercase tracking-widest font-black backdrop-blur-md">
                Service anfragen
              </a>
            </div>
          </motion.div>
        </div>

        {/* Floating Badges */}
        <div className="absolute bottom-12 right-12 hidden xl:flex gap-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-orange/20 text-brand-orange rounded-full flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div className="text-white">
              <div className="font-black uppercase tracking-widest text-[10px] text-brand-orange mb-1">Zertifiziert</div>
              <div className="text-sm font-bold">Meisterbetrieb</div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center">
              <Zap size={28} />
            </div>
            <div className="text-white">
              <div className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-1">Performance</div>
              <div className="text-sm font-bold">CUPRA Specialist</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Brands */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 items-center gap-12 opacity-40 hover:opacity-100 transition-opacity">
            <img src="/images/seat.svg" alt="SEAT" className="h-8 md:h-10 w-auto mx-auto transition-all hover:scale-110" />
            <img src="/images/cupra.svg" alt="CUPRA" className="h-8 md:h-12 w-auto mx-auto transition-all hover:scale-110 brightness-0" />
            <img src="/images/skoda.svg" alt="SKODA" className="h-8 md:h-10 w-auto mx-auto transition-all hover:scale-110" />
            <div className="hidden lg:block h-12 w-px bg-gray-200 mx-auto"></div>
            <div className="col-span-2 md:col-span-1 text-center md:text-left">
              <div className="text-3xl font-black text-brand-dark italic">seit 1991.</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Tradition & Innovation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 bg-brand-gray relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-orange mb-4">Exzellenz im Fokus</h2>
              <div className="text-4xl md:text-6xl font-black text-brand-dark leading-tight uppercase tracking-tighter">
                LEISTUNG, DIE BEGEISTERT.
              </div>
            </div>
            <button className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-brand-orange group">
              Alle Leistungen ansehen <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { 
                icon: <Car size={32} />, 
                title: "Premium Neuwagen", 
                desc: "Entdecken Sie die neuesten technologischen Meilensteine von SEAT, CUPRA und SKODA direkt vor Ort.",
                image: "/images/premium-neuwagen.jpg"
              },
              { 
                icon: <Settings size={32} />, 
                title: "Meisterwerkstatt", 
                desc: "Zertifizierter Service nach strengsten Herstellervorgaben für maximale Langlebigkeit Ihres Fahrzeugs.",
                image: "/images/meisterwerkstatt.jpg"
              },
              { 
                icon: <Zap size={32} />, 
                title: "E-Mobilität", 
                desc: "Die Zukunft ist elektrisch. Wir beraten Sie umfassend zu Ladeinfrastruktur und E-Modellen.",
                image: "/images/e-mobilitaet.jpg"
              },
            ].map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -20 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-200/50 flex flex-col h-full group"
              >
                <div className="h-64 relative overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-8 left-8 w-14 h-14 bg-brand-orange text-white rounded-2xl flex items-center justify-center shadow-2xl">
                    {s.icon}
                  </div>
                </div>
                <div className="p-10 flex-grow flex flex-col">
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed mb-8 flex-grow">{s.desc}</p>
                  <a href="#" className="font-black uppercase tracking-widest text-xs flex items-center gap-2 group/link text-brand-dark hover:text-brand-orange transition-colors">
                    Details lesen <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Teaser */}
      <section className="py-32 bg-brand-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-10 leading-tight tracking-tighter">BEREIT FÜR EINE <br /><span className="text-brand-orange">PROBEFAHRT?</span></h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Steigen Sie ein und erleben Sie die Dynamik unserer neuesten Modelle hautnah. Unser Team findet den passenden Termin für Sie.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="tel:+49393081234" className="bg-white text-brand-dark px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all shadow-2xl shadow-white/5">
                039308 1234
              </a>
              <a href="/kontakt" className="border-2 border-white/20 px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                Online Termin
              </a>
            </div>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/5 rounded-full pointer-events-none"></div>
      </section>

      {/* Detailed Search Mockup */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-brand-gray rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter leading-none">
                  FINDEN SIE <br />IHR NÄCHSTES <br /><span className="text-brand-orange">TRAUMAUTO.</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                  {/* Brand Filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Marke</label>
                    <div className="relative group">
                      <select 
                        className="w-full bg-white p-4 rounded-xl border border-gray-100 text-sm font-black text-brand-dark appearance-none outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        title="Marke wählen"
                      >
                        <option value="">Alle Marken</option>
                        {brands.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Model Filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Modell</label>
                    <div className="relative group">
                      <select 
                        className="w-full bg-white p-4 rounded-xl border border-gray-100 text-sm font-black text-brand-dark appearance-none outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer disabled:opacity-50"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        disabled={!selectedBrand}
                        title="Modell wählen"
                      >
                        <option value="">Alle Modelle</option>
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Preis bis</label>
                    <div className="relative group">
                      <select 
                        className="w-full bg-white p-4 rounded-xl border border-gray-100 text-sm font-black text-brand-dark appearance-none outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer"
                        value={selectedPrice}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                        title="Maximalpreis wählen"
                      >
                        <option value="">Beliebig</option>
                        <option value="15000">bis 15.000 €</option>
                        <option value="25000">bis 25.000 €</option>
                        <option value="35000">bis 35.000 €</option>
                        <option value="50000">bis 50.000 €</option>
                      </select>
                      <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Mileage Filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Kilometerstand</label>
                    <div className="relative group">
                      <select 
                        className="w-full bg-white p-4 rounded-xl border border-gray-100 text-sm font-black text-brand-dark appearance-none outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer"
                        value={selectedMileage}
                        onChange={(e) => setSelectedMileage(e.target.value)}
                        title="Maximalen Kilometerstand wählen"
                      >
                        <option value="">Beliebig</option>
                        <option value="10000">bis 10.000 km</option>
                        <option value="20000">bis 20.000 km</option>
                        <option value="50000">bis 50.000 km</option>
                        <option value="100000">bis 100.000 km</option>
                      </select>
                      <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-300 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSearch}
                  className="w-full bg-brand-orange hover:bg-brand-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-orange/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Fahrzeugsuche starten <ArrowRight size={20} />
                </button>
              </div>
              <div className="flex-1 w-full lg:w-auto">
                <AnimatePresence mode="wait">
                  {topVehicle ? (
                    <motion.div 
                      key={topVehicle.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer"
                    >
                      <Link href={`/fahrzeuge/${topVehicle.external_id}`}>
                        <img 
                          src={topVehicle.image || "/images/skoda-ocatvia.jpg"} 
                          alt={topVehicle.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                        />
                        
                        {/* Premium Glassmorphism Badge */}
                        <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 p-6 md:p-10 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl md:rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center text-white ring-1 ring-white/10 shadow-2xl">
                          <div className="text-center md:text-left mb-4 md:mb-0">
                            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                              <span className="w-6 md:w-8 h-px bg-brand-orange"></span>
                              <div className="text-[8px] md:text-[10px] uppercase font-black tracking-[0.3em] text-brand-orange">Top Angebot</div>
                            </div>
                            <div className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-none">{topVehicle.title}</div>
                          </div>
                          <div className="flex flex-col items-center md:items-end">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl md:text-4xl font-black tracking-tighter">
                                {fin ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(fin.monthlyInstallment).replace(',00', '') : topVehicle.price}
                              </span>
                              {fin && <span className="text-[10px] uppercase font-black opacity-60 tracking-widest">/ Monat</span>}
                            </div>
                            <div className="text-[8px] md:text-[9px] uppercase font-black tracking-[0.2em] opacity-40 mt-1">Ohne Anzahlung | {fin?.paybackPeriod?.replace('MONTHS_', '') || '36'} Mo.</div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ) : (
                    <div className="aspect-[4/3] rounded-[2rem] bg-gray-200 animate-pulse flex items-center justify-center text-gray-400 font-black uppercase tracking-widest text-xs italic">
                      Lade exklusives Angebot...
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
