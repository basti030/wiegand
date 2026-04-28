const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('vehicles').select('id, external_id, title, raw_data').limit(20);
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  console.log('Vehicles:');
  data.forEach(v => {
    const ad = v.raw_data || {};
    console.log(`ID: ${v.id} | ExtID: ${v.external_id} | Title: ${v.title}`);
    console.log(`Location info in raw_data:`, ad.location || ad.dealer || ad.seller || ad.pointOfSale);
  });
}

run();
