import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function repairTitles() {
  console.log('🔧 Starting Title Repair Script...');
  
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('id, raw_data, brand, title');

  if (error || !vehicles) {
    console.error('❌ Failed to fetch vehicles:', error?.message);
    return;
  }

  console.log(`📊 Processing ${vehicles.length} vehicles...`);
  let fixedCount = 0;

  for (const v of vehicles) {
    const ad = (v.raw_data as any) || {};
    const make = ad.make || v.brand || '';
    const model = ad.model || '';
    let newTitle = `${make} ${model}`.trim();

    if (!newTitle || newTitle.includes('undefined')) {
      newTitle = ad.title || v.title?.replace(/undefined/g, '').trim() || 'Fahrzeug ohne Titel';
    }

    if (newTitle !== v.title) {
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ title: newTitle, brand: make || v.brand })
        .eq('id', v.id);

      if (!updateError) {
        console.log(`✅ Fixed: "${v.title}" -> "${newTitle}"`);
        fixedCount++;
      } else {
        console.error(`❌ Failed to update ${v.id}:`, updateError.message);
      }
    }
  }

  console.log(`✨ Finished! Repaired ${fixedCount} titles.`);
}

repairTitles();
