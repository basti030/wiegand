import { supabaseAdmin as supabase } from '../lib/supabase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env.local') });

const employees = [
  {
    "name": "Jan Leitner",
    "role": "Betriebsleiter",
    "email": "jan.leitner@auto-wiegand.de",
    "phone": "06041/82338-10",
    "department": "Verkauf CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/jan-leitner.jpg"
  },
  {
    "name": "Jürgen Wegner",
    "role": "Verkaufsleiter Gruppe",
    "email": "juergen.wegner@auto-wiegand.de",
    "phone": "06051/9291-21",
    "department": "Verkauf CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/juergen-wegner.jpg"
  },
  {
    "name": "Stieven Erk",
    "role": "Verkaufsberater Großkunden",
    "email": "stieven.erk@auto-wiegand.de",
    "phone": "06051/9291-46",
    "department": "Verkauf CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/stieven-erk.jpg"
  },
  {
    "name": "Sebastian Kolb",
    "role": "Verkaufsberater",
    "email": "sebastian.Kolb@auto-wiegand.de",
    "phone": "06041/82338-17",
    "department": "Verkauf CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/sebastian-kolb.jpg"
  },
  {
    "name": "Patrick Schenk",
    "role": "Verkaufsberater",
    "email": "patrick.schenk@auto-wiegand.de",
    "phone": "06041/82338-15",
    "department": "Verkauf CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/patrick-schenk.png"
  },
  {
    "name": "Alessandro Vitale",
    "role": "Auszubildender Automobilkaufmann",
    "email": "alessandro.vitale@auto-wiegand.de",
    "phone": "06041/82338-0",
    "department": "Verkauf CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/alessandro-vitale.jpeg"
  },
  {
    "name": "Sebastian Kipper",
    "role": "Fahrzeug-Bestandsmanager",
    "email": "Sebastian.Kipper@auto-wiegand.de",
    "phone": "06051/9291-0",
    "department": "Fahrzeugabwicklungsmanagement",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/sebastian-kipper.jpeg"
  },
  {
    "name": "Marcus Pabst",
    "role": "Einkäufer",
    "email": "marcus.pabst@auto-wiegand.de",
    "phone": "06041/82338-19",
    "department": "Fahrzeugabwicklungsmanagement",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/marcus-pabst.jpeg"
  },
  {
    "name": "Benedikt Grimm",
    "role": "Serviceberater",
    "email": "benedikt.grimm@auto-wiegand.de",
    "phone": "06041/82338-21",
    "department": "Service CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/benedikt-grimm.jpg"
  },
  {
    "name": "Daniel Sommer",
    "role": "Serviceberater",
    "email": "daniel.sommer@auto-wiegand.de",
    "phone": "06041/82338-16",
    "department": "Service CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/daniel-sommer.jpg"
  },
  {
    "name": "Kerstin Niederhöfer",
    "role": "Serviceassistentin",
    "email": "kerstin.niederhoefer@auto-wiegand.de",
    "phone": "06041/82338-0",
    "department": "Service CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/kerstin-niederhoefer.jpg"
  },
  {
    "name": "Florian Zinn",
    "role": "Teiledienstleiter Gruppe",
    "email": "florian.zinn@auto-wiegand.de",
    "phone": "06041/82338-22",
    "department": "Teile & Zubehör",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/florian-zinn.jpg"
  },
  {
    "name": "Hanna Dalecki",
    "role": "Teile & Zubehör",
    "email": "teiledienst.buedingen@auto-wiegand.de",
    "phone": "06041/82338-22",
    "department": "Teile & Zubehör",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/hanna-dalecki.jpeg"
  },
  {
    "name": "Torsten Welisch",
    "role": "Servicetechniker / Werkstattleiter",
    "email": "werkstatt@auto-wiegand.de",
    "phone": "06041/82338-22",
    "department": "Werkstatt",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/torsten-welisch.jpg"
  },
  {
    "name": "Kai Andres",
    "role": "Servicetechniker / Stellv. Werkstattleiter",
    "email": "kai.andres@auto-wiegand.de",
    "phone": "06041/82338-22",
    "department": "Werkstatt",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/kai-andres.jpeg"
  },
  {
    "name": "Sabine Nanz",
    "role": "Kundenbetreuung",
    "email": "sabine.nanz@auto-wiegand.de",
    "phone": "06041/82338-13",
    "department": "Kundenbetreuung",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/sabine-nanz.jpg"
  },
  {
    "name": "Raphael Wiegand",
    "role": "Geschäftsführender Gesellschafter",
    "email": "raphael.wiegand@auto-wiegand.de",
    "phone": "06041/82338-0",
    "department": "Geschäftsführung",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/raphael-wiegand.jpg"
  },
  {
    "name": "Dominik Matern",
    "role": "Operativer Leiter",
    "email": "dominik.matern@auto-wiegand.de",
    "phone": "06051/9291-23",
    "department": "Geschäftsführung",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/dominik-matern.jpg"
  },
  {
    "name": "Marcus-Anthony Alexander",
    "role": "Verkaufsberater",
    "email": "Marcus.Alexander@auto-wiegand.de",
    "phone": "06051/9291-37",
    "department": "Verkauf CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/marcus-anthony-alexander.jpg"
  },
  {
    "name": "Timo Grauel",
    "role": "Verkaufsberater",
    "email": "timo.grauel@auto-wiegand.de",
    "phone": "06051/9291-36",
    "department": "Verkauf CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/timo-grauel.jpeg"
  },
  {
    "name": "Jonah Junk",
    "role": "Verkaufsberater",
    "email": "Jonah.Junk@auto-wiegand.de",
    "phone": "06051/9291-38",
    "department": "Verkauf CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/jonah-junk.jpg"
  },
  {
    "name": "Merve Türkarslan",
    "role": "Verkaufsberaterin Onlinevertrieb",
    "email": "merve.tuerkarslan@auto-wiegand.de",
    "phone": "06051/9291-26",
    "department": "Verkauf CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/merve-tuerkarslan.jpg"
  },
  {
    "name": "Chiara-Marie Reich",
    "role": "Auszubildende Automobilkauffrau",
    "email": "chiara-marie.reich@auto-wiegand.de",
    "phone": "06051/9291-0",
    "department": "Verkauf CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/chiara-marie-reich.jpeg"
  },
  {
    "name": "Atta Hosseini",
    "role": "Verkaufsleiter Gruppe",
    "email": "atta.hosseini@auto-wiegand.de",
    "phone": "06051/9291-47",
    "department": "Verkauf Škoda",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/atta-hosseini.jpeg"
  },
  {
    "name": "Kerstin Hahnsch",
    "role": "Verkaufsberaterin",
    "email": "Kerstin.Hahnsch@auto-wiegand.de",
    "phone": "06051/9291-45",
    "department": "Verkauf Škoda",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/kerstin-hahnsch.png"
  },
  {
    "name": "Markus Schaum",
    "role": "Verkaufsberater",
    "email": "markus.schaum@auto-wiegand.de",
    "phone": "06051/9291-41",
    "department": "Verkauf Škoda",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/markus-schaum.png"
  },
  {
    "name": "Sven Sieg",
    "role": "Verkaufsberater",
    "email": "sven.sieg@auto-wiegand.de",
    "phone": "06051/9291-44",
    "department": "Verkauf Škoda",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/sven-sieg.jpg"
  },
  {
    "name": "Nadine Wierschin",
    "role": "Serviceleiterin Gruppe",
    "email": "nadine.wierschin@auto-wiegand.de",
    "phone": "06051/9291-11",
    "department": "Service CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/nadine-wierschin.jpg"
  },
  {
    "name": "Roman Friedrich",
    "role": "Serviceberater",
    "email": "roman.friedrich@auto-wiegand.de",
    "phone": "06051/9291-13",
    "department": "Service CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/roman-friedrich.jpg"
  },
  {
    "name": "Nico Miroshnychenko",
    "role": "Serviceberater",
    "email": "nico.miroshnychenko@auto-wiegand.de",
    "phone": "06051/9291-17",
    "department": "Service CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/nico-miroshnychenko.jpeg"
  },
  {
    "name": "Liam Urban",
    "role": "Serviceberater",
    "email": "liam.urban@auto-wiegand.de",
    "phone": "06051/9291-12",
    "department": "Service CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/liam-urban.jpg"
  },
  {
    "name": "Lisa Behr",
    "role": "Serviceassistentin",
    "email": "lisa.behr@auto-wiegand.de",
    "phone": "06051/9291-0",
    "department": "Service CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/lisa-behr.jpg"
  },
  {
    "name": "Nikola Henn",
    "role": "Serviceassistentin",
    "email": "nikola.henn@auto-wiegand.de",
    "phone": "06051/9291-0",
    "department": "Service CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/nikola-henn.jpeg"
  },
  {
    "name": "Marina Mikic",
    "role": "Serviceassistentin",
    "email": "marina.mikic@auto-wiegand.de",
    "phone": "06051/9291-0",
    "department": "Service CUPRA / SEAT",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/marina-mikic.jpg"
  },
  {
    "name": "Uwe Weiskopf",
    "role": "Teamleiter Service",
    "email": "uwe.weiskopf@auto-wiegand.de",
    "phone": "06051/9291-43",
    "department": "Service Škoda",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/uwe-weiskopf.jpg"
  },
  {
    "name": "Thomas Jankowsky",
    "role": "Teile & Zubehör",
    "email": "thomas.jankowsky@auto-wiegand.de",
    "phone": "06051/9291-14",
    "department": "Teile & Zubehör",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/thomas-jankowsky.png"
  },
  {
    "name": "Toni Benda",
    "role": "Werkstattleiter",
    "email": "Toni.benda@auto-wiegand.de",
    "phone": "06051/9291-15",
    "department": "Werkstatt",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/toni-benda.jpg"
  },
  {
    "name": "Melanie Füredi",
    "role": "Marketing- und Social-Media-Managerin",
    "email": "melanie.fueredi@auto-wiegand.de",
    "phone": "06051/9291-25",
    "department": "Marketing & Social Media",
    "image_url": "https://www.auto-wiegand.de/themes/Frontend/Wiegand/frontend/_public/src/img/employee/melanie-fueredi.jpeg"
  }
];

async function seed() {
  console.log('🌱 Seeding employees...');
  
  try {
    const { error } = await supabase
      .from('employees')
      .upsert(employees, { onConflict: 'email' });

    if (error) throw error;

    console.log(`✅ Successfully seeded ${employees.length} employees.`);
  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message);
  }
}

seed();
