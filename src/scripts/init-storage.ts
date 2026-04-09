import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function initStorage() {
  console.log('📦 Initializing Storage...');
  
  const { data, error } = await supabase.storage.createBucket('vehicle-images', {
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['image/jpeg', 'image/png']
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Bucket "vehicle-images" already exists.');
    } else {
      console.error('❌ Error creating bucket:', error.message);
    }
  } else {
    console.log('✅ Bucket "vehicle-images" created successfully.');
  }
}

initStorage();
