import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function syncEmployees() {
  console.log('👥 Starting Employee Synchronization...');

  const dataPath = '/tmp/employees_scraped.json';
  if (!fs.existsSync(dataPath)) {
    console.error('❌ Scraped data not found at /tmp/employees_scraped.json');
    return;
  }

  const employees = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`📊 Loaded ${employees.length} employees from JSON.`);

  let successCount = 0;
  let errorCount = 0;

  for (const emp of employees) {
    try {
      // Mapping scraper data to DB schema
      const dbEntry = {
        name: emp.name,
        role: emp.position,
        email: emp.email,
        phone: emp.phone,
        image_url: emp.image,
        department: `[${emp.location}] ${emp.position}`,
        order_index: 0
      };

      const { error } = await supabase
        .from('employees')
        .upsert(dbEntry, { onConflict: 'email' });

      if (error) {
        console.error(`❌ Error upserting ${emp.name}:`, error.message);
        errorCount++;
      } else {
        successCount++;
        process.stdout.write('.');
      }
    } catch (err: any) {
      console.error(`💥 Failed to process ${emp.name}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n\n✅ Sync Summary:');
  console.log(`- Total Processed: ${employees.length}`);
  console.log(`- Successfully Upserted: ${successCount}`);
  console.log(`- Errors: ${errorCount}`);
}

syncEmployees();
