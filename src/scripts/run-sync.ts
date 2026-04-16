import { runVehicleSync } from '../lib/sync-service';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables for local testing or GitHub runners
dotenv.config({ path: join(process.cwd(), '.env.local') });
dotenv.config();

/**
 * Main execution script for the vehicle sync.
 * This is designed to be run by GitHub Actions to avoid Vercel timeouts.
 */
async function run() {
  console.log('🚀 Starting Wiegand Vehicle Sync Script (via CLI/GitHub)...');
  
  try {
    // Get logId from command line arguments if provided
    const logId = process.argv[2];
    if (logId) console.log(`📋 Using existing Log ID: ${logId}`);

    // We always force the sync when run manually or via scheduled cron to ensure fresh data
    const result = await runVehicleSync(logId);
    
    if (result.success) {
      console.log(`\n✅ Sync Completed Successfully.`);
      process.exit(0);
    } else {
      console.error(`\n❌ Sync Failed: ${result.error}`);
      process.exit(1);
    }

  } catch (err: any) {
    console.error('\n❌ Fatal Sync Error:', err.message);
    process.exit(1);
  }
}

run();
