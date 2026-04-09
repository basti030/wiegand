import { Mail, Phone, MessageSquare, MapPin, Users, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function TeamPage() {
  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching employees:', error);
  }

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const getEmployeeImage = (name: string) => {
    const slug = slugify(name);
    const extensions: Record<string, string> = {
      'alessandro-vitale': 'jpeg',
      'atta-hosseini': 'jpeg',
      'chiara-marie-reich': 'jpeg',
      'hanna-dalecki': 'jpeg',
      'kai-andres': 'jpeg',
      'marcus-pabst': 'jpeg',
      'melanie-fueredi': 'jpeg',
      'nico-miroshnychenko': 'jpeg',
      'nikola-henn': 'jpeg',
      'sebastian-kipper': 'jpeg',
      'timo-grauel': 'jpeg',
      'kerstin-hahnsch': 'png',
      'markus-schaum': 'png',
      'patrick-schenk': 'png',
      'thomas-jankowsky': 'png'
    };
    
    const ext = extensions[slug] || 'jpg';
    return `/images/employee/${slug}.${ext}`;
  };

  // Define Group Structure
  interface Group {
    id: string;
    title: string;
    departments: Record<string, any[]>;
  }

  const locationGroups: Record<string, Group> = {
    buedingen: { 
      id: "buedingen", 
      title: 'Autohaus Wiegand "Büdingen"', 
      departments: {
        "Verkauf CUPRA / SEAT": [],
        "Fahrzeugabwicklungsmanagement": [],
        "Service CUPRA / SEAT": [],
        "Teile & Zubehör": [],
        "Werkstatt": [],
        "Kundenbetreuung": []
      } 
    },
    gelnhausen: { 
      id: "gelnhausen", 
      title: 'Autohaus Wiegand "Gelnhausen"', 
      departments: {
        "Verkauf CUPRA / SEAT": [],
        "Verkauf Škoda": [],
        "Fahrzeugabwicklungsmanagement": [],
        "Service CUPRA / SEAT": [],
        "Service Škoda": [],
        "Teile & Zubehör": [],
        "Werkstatt": [],
        "Kundenbetreuung": [],
        "Marketing & Social Media": []
      } 
    },
    management: {
      id: "management",
      title: "Geschäftsführung",
      departments: { "Unternehmensleitung": [] }
    }
  };

  // Advanced Categorization Logic
  employees?.forEach(member => {
    const role = (member.role || '').toUpperCase();
    const dept = (member.department || '').toUpperCase();
    const searchString = `${role} ${dept}`;
    
    let locKey = "buedingen";
    let deptKey = member.department || "Team";

    // 1. Management Check (Global Bottom)
    if (searchString.includes('GESCHÄFTSFÜHRUNG') || searchString.includes('INHABER')) {
      locationGroups.management.departments["Unternehmensleitung"].push(member);
      return;
    }

    // 2. Location Check
    if (searchString.includes('GELNHAUSEN') || searchString.includes('GEL')) {
      locKey = "gelnhausen";
    }

    // 3. Department Mapping
    if (searchString.includes('VERKAUF') || searchString.includes('BESTANDSMANAGER') || role.includes('BETRIEBSLEITER')) {
      if (searchString.includes('SKODA') || searchString.includes('ŠKODA')) deptKey = "Verkauf Škoda";
      else deptKey = "Verkauf CUPRA / SEAT";
    } else if (searchString.includes('ABWICKLUNG') || searchString.includes('DISPOSITION')) {
      deptKey = "Fahrzeugabwicklungsmanagement";
    } else if (searchString.includes('SERVICE')) {
      if (searchString.includes('SKODA') || searchString.includes('ŠKODA')) deptKey = "Service Škoda";
      else deptKey = "Service CUPRA / SEAT";
    } else if (searchString.includes('TEILE') || searchString.includes('LAGER')) {
      deptKey = "Teile & Zubehör";
    } else if (searchString.includes('WERKSTATT') || searchString.includes('MECHANIK')) {
      deptKey = "Werkstatt";
    } else if (searchString.includes('KUNDE') || searchString.includes('BETREUUNG') || searchString.includes('KASSE')) {
      deptKey = "Kundenbetreuung";
    } else if (searchString.includes('MARKETING')) {
      deptKey = "Marketing & Social Media";
    }

    if (!locationGroups[locKey].departments[deptKey]) {
      locationGroups[locKey].departments[deptKey] = [];
    }
    locationGroups[locKey].departments[deptKey].push(member);
  });

  // Final Sorting (Manual Overrides for Hierarchy)
  Object.values(locationGroups).forEach(group => {
    Object.values(group.departments).forEach(members => {
      members.sort((a, b) => {
        const roleA = a.role.toUpperCase();
        const roleB = b.role.toUpperCase();
        
        // Priority 1: Betriebsleiter
        if (roleA.includes('BETRIEBSLEITER')) return -1;
        if (roleB.includes('BETRIEBSLEITER')) return 1;
        
        // Priority 2: Leitung/Leiter
        if (roleA.includes('LEITUNG') || roleA.includes('LEITER')) return -1;
        if (roleB.includes('LEITUNG') || roleB.includes('LEITER')) return 1;
        
        return 0; // Maintain alphabetical (already ordered)
      });
    });
  });

  const activeGroups = Object.values(locationGroups).filter(g => 
    Object.values(g.departments).some(d => d.length > 0)
  );

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Hero Header */}
      <div className="bg-brand-dark text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-brand-orange text-xs font-black uppercase tracking-[0.4em] mb-4">Ansprechpartner</h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white font-black uppercase tracking-tighter">Mitarbeiter</h1>
          <h3 className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Unser Team: <span className="text-white">kompetent und immer für Sie da!</span>
          </h3>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-brand-orange rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-orange rounded-full blur-[120px]"></div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <nav className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-12 overflow-x-auto no-scrollbar whitespace-nowrap">
            {activeGroups.map(group => (
              <a 
                key={group.id} 
                href={`#${group.id}`}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-orange transition-colors py-2 flex items-center gap-2 group"
              >
                {group.id !== "management" && <MapPin size={12} className="group-hover:text-brand-orange transition-colors" />}
                {group.title.replace('Autohaus Wiegand ', '')}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Team Content */}
      <div className="container mx-auto px-4 py-20">
        {activeGroups.map((group) => (
          <section key={group.id} id={group.id} className="mb-32 scroll-mt-40 last:mb-12">
            {/* Location/Group Header */}
            <div className={`mb-20 border-b-2 pb-10 ${group.id === 'management' ? 'border-brand-dark/10' : 'border-brand-orange/10'}`}>
              <h2 className="text-4xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter leading-none mb-4">
                {group.title}
              </h2>
            </div>

            {Object.entries(group.departments).map(([divName, members], dIdx) => (
              members.length > 0 && (
                <div key={dIdx} className="mb-24 last:mb-0">
                  {/* Department Header */}
                  <div className="flex items-center gap-6 mb-12">
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-brand-dark whitespace-nowrap">
                      {divName}
                    </h3>
                    <div className="h-[2px] flex-1 bg-brand-orange/10"></div>
                  </div>

                  {/* Grid of Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {members.map((member, mIdx) => (
                      <div key={mIdx} className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-brand-orange/10 transition-all duration-500 border border-gray-100 hover:border-brand-orange/20">
                        {/* Image Holder */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-brand-gray">
                          <img 
                            src={member.image_url || getEmployeeImage(member.name)} 
                            alt={member.name} 
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                            <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] mb-1">Kontaktieren</span>
                            <div className="flex gap-2">
                              {member.phone && (
                                <a href={`tel:${member.phone}`} className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-brand-orange transition-colors">
                                  <Phone size={16} />
                                </a>
                              )}
                              {member.email && (
                                <a href={`mailto:${member.email}`} className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-brand-orange transition-colors">
                                  <Mail size={16} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h4 className="text-lg font-black text-brand-dark uppercase tracking-tight leading-tight mb-1 group-hover:text-brand-orange transition-colors">
                            {member.name}
                          </h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            {member.role.replace(/\[.*?\]\s*/g, '')}
                          </p>
                          
                          <div className="mt-6 pt-6 border-t border-gray-50 space-y-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            {member.phone && (
                              <div className="flex items-center gap-3 text-gray-500 text-xs font-bold">
                                <Phone size={12} className="text-brand-orange" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                            {member.email && (
                              <div className="flex items-center gap-3 text-gray-500 text-xs font-bold truncate">
                                <Mail size={12} className="text-brand-orange" />
                                <span className="truncate">{member.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <section className="bg-brand-gray py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-[10px] font-black text-brand-orange uppercase tracking-widest shadow-sm mb-8">
            <Users size={12} /> Karriere bei Auto Wiegand
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-brand-dark uppercase tracking-tighter">Wir suchen Verstärkung!</h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto text-lg leading-relaxed font-medium">
            Möchten Sie Teil unserer Erfolgsgeschichte werden? Wir bieten spannende Herausforderungen und ein familiäres Arbeitsumfeld.
          </p>
          <a href="/karriere" className="inline-flex items-center gap-4 bg-brand-dark text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-orange transition-all shadow-2xl shadow-brand-dark/20 hover:-translate-y-1">
            Alle Stellenanzeigen <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}

function ArrowRight({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
