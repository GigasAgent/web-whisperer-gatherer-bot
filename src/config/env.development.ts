
// src/config/env.development.ts
import { SupabaseConfig } from './environments';

// This configuration is used for the 'main' branch (local development and production builds)
const config: SupabaseConfig = {
  supabaseUrl: 'https://ebyzgsadxcxyzfffgeff.supabase.co', // TODO: Replace with your actual Supabase URL
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVieXpnc2FkeGN4eXpmZmZnZWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTU4MzcsImV4cCI6MjA2MzY3MTgzN30.yA88Y1uBh4IzMaW1HcpKw9shxyUXY_Qin45oEcOXhcs', // TODO: Replace with your actual Supabase Anon Key
};

export default config;
