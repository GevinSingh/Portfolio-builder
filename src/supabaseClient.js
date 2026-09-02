import { createClient } from "@supabase/supabase-js";

// ============================================================================
// SUPABASE CONFIGURATION
// Project URL: https://glhowtmwkgzylfoglwhy.supabase.co
// Publishable Key: sb_publishable_yEAo5ZQIbFqNq6M3omLoBw_7b5hyrdS
// ============================================================================

const getEnvVar = (key, fallback) => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

const SUPABASE_URL = getEnvVar(
  "NEXT_PUBLIC_SUPABASE_URL",
  getEnvVar("VITE_SUPABASE_URL", "https://glhowtmwkgzylfoglwhy.supabase.co")
);

const SUPABASE_PUBLIC_KEY = getEnvVar(
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  getEnvVar("VITE_SUPABASE_ANON_KEY", "sb_publishable_yEAo5ZQIbFqNq6M3omLoBw_7b5hyrdS")
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
