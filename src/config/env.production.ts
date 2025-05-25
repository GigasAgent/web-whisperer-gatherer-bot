
// src/config/env.production.ts
import { SupabaseConfig } from './environments';

const config: SupabaseConfig = {
  supabaseUrl: 'YOUR_PROD_SUPABASE_URL', // TODO: Replace with your actual PROD Supabase URL
  supabaseAnonKey: 'YOUR_PROD_SUPABASE_ANON_KEY', // TODO: Replace with your actual PROD Supabase Anon Key
};

export default config;
