
// src/config/environments.ts
export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

interface EnvironmentConfigs {
  development: SupabaseConfig;
  test: SupabaseConfig;
  production: SupabaseConfig;
  [key: string]: SupabaseConfig; // Index signature
}

// Import environment-specific configurations
import devConfig from './env.development';
import testConfig from './env.test';
import prodConfig from './env.production';

const configs: EnvironmentConfigs = {
  development: devConfig,
  test: testConfig,
  production: prodConfig,
};

export const getCurrentSupabaseConfig = (): SupabaseConfig => {
  const mode = import.meta.env.MODE || 'development'; // Default to development
  console.log(`Current Vite Mode: ${mode}`);
  // Ensure mode is one of the keys in configs, otherwise default or throw error
  if (configs[mode]) {
    return configs[mode];
  }
  console.warn(`No specific Supabase config found for mode: ${mode}. Defaulting to development.`);
  return configs.development; // Fallback to development
};
