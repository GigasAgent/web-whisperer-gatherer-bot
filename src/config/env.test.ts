
// src/config/env.test.ts
import { SupabaseConfig } from './environments';

// This configuration is used for the 'test' branch
const config: SupabaseConfig = {
  supabaseUrl: 'https://desgwelmvfuktvpfkdnc.supabase.co', // TODO: Replace with your actual Supabase URL (same as development)
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlc2d3ZWxtdmZ1a3R2cGZrZG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxODQzMTAsImV4cCI6MjA2Mzc2MDMxMH0.FAGek7EeZEniiiczgnRaYfX2dT4GosYlY6g6BN9yI9gYOUR_SUPABASE_ANON_KEY', // TODO: Replace with your actual Supabase Anon Key (same as development)
};

export default config;
