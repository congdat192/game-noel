import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
// It's best practice to store these in environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL_PLACEHOLDER';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_PLACEHOLDER';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('PLACEHOLDER') || supabaseAnonKey.includes('PLACEHOLDER')) {
  console.warn('Supabase URL or Anon Key is not set. Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
