import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: join(process.cwd(), '.env.local') });
}
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Fallback for Build Time (Vercel) to prevent 'supabaseUrl is required' error
const finalUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalKey = supabaseServiceKey || 'placeholder-key';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase URL or Service Key is missing. Using placeholders for build stability.');
}

export const supabaseAdmin = createClient(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
