
// src/config/environments.ts
export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

interface EnvironmentConfigs {
  development: SupabaseConfig;
  test: SupabaseConfig;
  [key: string]: SupabaseConfig | undefined; // Index signature, allowing undefined for keys like 'production'
}

// Import environment-specific configurations
import devConfig from './env.development';
import testConfig from './env.test';
// No production config file, as 'production' mode will use 'development' settings

const configs: EnvironmentConfigs = {
  development: devConfig,
  test: testConfig,
};

export const getCurrentSupabaseConfig = (): SupabaseConfig => {
  const mode = import.meta.env.MODE || 'development'; // Default to development
  console.log(`Current Vite Mode: ${mode}`);

  if (configs[mode]) {
    return configs[mode]!; // Mode is 'development' or 'test'
  }
  
  // If mode is 'production' (e.g., from 'npm run build'), use the 'development' config
  // as 'main' branch serves both development and production builds against the same Supabase project.
  if (mode === 'production' && configs.development) {
    console.warn(`Vite Mode is 'production', using 'development' Supabase config for the 'main' branch.`);
    return configs.development;
  }

  console.warn(`No specific Supabase config found for mode: ${mode}. Defaulting to development.`);
  return configs.development!; // Fallback to development
};
