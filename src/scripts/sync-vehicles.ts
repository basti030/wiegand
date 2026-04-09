import * as dotenv from 'dotenv';
import { runVehicleSync } from '../lib/sync-service';

dotenv.config({ path: '.env.local' });

async function main() {
  const result = await runVehicleSync();
  if (result.success) {
    console.log('✅ Sync completed successfully:', result);
  } else {
    console.error('❌ Sync failed:', result.error);
    process.exit(1);
  }
}

main();
