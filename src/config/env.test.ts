
// src/config/env.test.ts
import { SupabaseConfig } from './environments';

// This configuration is used for the 'test' branch
const config: SupabaseConfig = {
  supabaseUrl: 'YOUR_SUPABASE_URL', // TODO: Replace with your actual Supabase URL (same as development)
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY', // TODO: Replace with your actual Supabase Anon Key (same as development)
};

export default config;
