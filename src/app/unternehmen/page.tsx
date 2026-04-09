import { Mail, Phone, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function TeamPage() {
  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .order('department', { ascending: true })
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

  // Helper to get image path (mapping extensions correctly based on the folder contents)
  const getEmployeeImage = (name: string) => {
    const slug = slugify(name);
    // These maps reflect the actual file extensions found in public/images/employee
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

  // Gruppierung nach Abteilungen
  const departments = employees ? employees.reduce((acc: any, member: any) => {
    const dept = member.department || 'Allgemein';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {}) : {};

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-brand-dark text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-6 text-white font-black uppercase tracking-tight">Unser Team</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
            Lernen Sie die Menschen kennen, die täglich für Ihre Mobilität sorgen. 
            Persönlich, kompetent und immer für Sie da.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-brand-orange rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-brand-orange rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {Object.keys(departments).map((deptName, idx) => (
          <div key={idx} className="mb-24 last:mb-0">
            <div className="flex items-center gap-4 mb-14">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange whitespace-nowrap">{deptName}</h2>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {departments[deptName].map((member: any, mIdx: number) => (
                <div key={mIdx} className="group bg-brand-gray rounded-[2.5rem] overflow-hidden hover:bg-white hover:shadow-2xl hover:shadow-brand-orange/10 transition-all duration-500 border border-transparent hover:border-brand-orange/10 pb-4">
                  <div className="p-10 flex flex-col items-center text-center">
                    <div className="w-44 h-44 rounded-[3rem] overflow-hidden shadow-2xl mb-8 border-4 border-white group-hover:rotate-2 transition-transform duration-500 bg-white">
                      <img 
                        src={member.image_url || getEmployeeImage(member.name)} 
                        alt={member.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110" 
                      />
                    </div>
                    <h3 className="text-2xl font-black text-brand-dark group-hover:text-brand-orange transition-colors uppercase tracking-tight">{member.name}</h3>
                    <p className="text-brand-orange font-black uppercase tracking-widest text-[10px] mt-1">{member.role}</p>
                  </div>

                  <div className="p-8 pt-4 space-y-4">
                    {member.phone && (
                      <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-600 hover:text-brand-orange transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-200 group-hover:border-brand-orange/20 shadow-sm">
                          <Phone size={14} className="text-brand-orange" />
                        </div>
                        <span className="text-sm font-bold">{member.phone}</span>
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-gray-600 hover:text-brand-orange transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-200 group-hover:border-brand-orange/20 shadow-sm">
                          <Mail size={14} className="text-brand-orange" />
                        </div>
                        <span className="text-sm font-bold truncate">{member.email}</span>
                      </a>
                    )}
                  </div>

                  <div className="px-8 pb-8">
                    <a 
                      href={`mailto:${member.email}?subject=Anfrage an ${member.name} via auto-wiegand.de`}
                      className="w-full py-5 bg-white border border-gray-200 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-orange hover:text-white hover:border-brand-orange hover:shadow-2xl hover:shadow-brand-orange/20 transition-all group/btn text-brand-dark hover:no-underline"
                    >
                      <MessageSquare size={18} className="group-hover/btn:scale-110 transition-transform" /> 
                      <span className="text-[10px] uppercase tracking-widest">Nachricht senden</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className="bg-brand-gray py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-black mb-6 text-brand-dark uppercase tracking-tight">Wir suchen Verstärkung!</h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto text-lg leading-relaxed font-medium">
            Haben Sie Benzin im Blut? Werden Sie Teil unseres Teams und gestalten Sie die Mobilität von morgen mit.
          </p>
          <a href="/karriere" className="btn-primary inline-flex text-sm font-black uppercase tracking-widest px-12 py-5 shadow-2xl shadow-brand-orange/20">
            Zu den Stellenanzeigen
          </a>
        </div>
      </section>
    </div>
  );
}
