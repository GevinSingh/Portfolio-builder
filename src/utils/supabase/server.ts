import { createServerClient } from '@supabase/ssr';

export function createClient(cookieStore?: any) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://glhowtmwkgzylfoglwhy.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_yEAo5ZQIbFqNq6M3omLoBw_7b5hyrdS',
    {
      cookies: {
        getAll() {
          return cookieStore?.getAll?.() || [];
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore?.set?.(name, value, options)
            );
          } catch {
            // Server Component context fallback
          }
        },
      },
    }
  );
}
