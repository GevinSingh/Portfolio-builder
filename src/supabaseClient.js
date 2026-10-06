import { createClient } from "@supabase/supabase-js";

// ============================================================================
// SUPABASE CONFIGURATION
// Keys are read from .env / environment variables — never hardcoded here.
// Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
// ============================================================================

const getEnvVar = (key) => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  return null;
};

const SUPABASE_URL =
  getEnvVar("VITE_SUPABASE_URL") ||
  getEnvVar("NEXT_PUBLIC_SUPABASE_URL") ||
  getEnvVar("SUPABASE_URL");

const SUPABASE_PUBLIC_KEY =
  getEnvVar("VITE_SUPABASE_ANON_KEY") ||
  getEnvVar("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
  getEnvVar("SUPABASE_ANON_KEY");

if (!SUPABASE_URL || !SUPABASE_PUBLIC_KEY) {
  console.warn(
    "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables. " +
    "Cloud sync will be disabled. Check your .env file."
  );
}

export const supabase = SUPABASE_URL && SUPABASE_PUBLIC_KEY
  ? createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY)
  : null;
