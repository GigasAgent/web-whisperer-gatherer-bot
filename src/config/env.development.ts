
// src/config/env.development.ts
import { SupabaseConfig } from './environments';

// This configuration is used for the 'main' branch (local development and production builds)
const config: SupabaseConfig = {
  supabaseUrl: 'YOUR_SUPABASE_URL', // TODO: Replace with your actual Supabase URL
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY', // TODO: Replace with your actual Supabase Anon Key
};

export default config;
