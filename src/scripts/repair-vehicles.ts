import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function repairVehicles() {
  console.log('🔧 Starting Comprehensive Vehicle Repair Script...');
  
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('id, raw_data, brand, title, price');

  if (error || !vehicles) {
    console.error('❌ Failed to fetch vehicles:', error?.message);
    return;
  }

  console.log(`📊 Processing ${vehicles.length} vehicles...`);
  let fixedTitles = 0;
  let fixedPrices = 0;

  for (const v of vehicles) {
    const ad = (v.raw_data as any) || {};
    
    // 1. Repair Title
    const make = ad.make || v.brand || '';
    const model = ad.model || '';
    let newTitle = `${make} ${model}`.trim();

    if (!newTitle || newTitle.includes('undefined')) {
      newTitle = ad.title || v.title?.replace(/undefined/g, '').trim() || 'Fahrzeug ohne Titel';
    }

    // 2. Repair Price
    const priceValue = ad.price?.consumerPriceGross;
    const newPrice = priceValue 
      ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(priceValue)
      : 'Auf Anfrage';

    // 3. Update if changed
    if (newTitle !== v.title || newPrice !== v.price) {
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ 
          title: newTitle, 
          brand: make || v.brand,
          price: newPrice
        })
        .eq('id', v.id);

      if (!updateError) {
        if (newTitle !== v.title) fixedTitles++;
        if (newPrice !== v.price) fixedPrices++;
        console.log(`✅ Fixed vehicle ${v.id}: Title->"${newTitle}", Price->"${newPrice}"`);
      } else {
        console.error(`❌ Failed to update ${v.id}:`, updateError.message);
      }
    }
  }

  console.log(`✨ Finished! Repaired ${fixedTitles} titles and ${fixedPrices} prices.`);
}

repairVehicles();
