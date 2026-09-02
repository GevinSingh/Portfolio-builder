import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: any) {
  let supabaseResponse = { headers: new Headers() };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://glhowtmwkgzylfoglwhy.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_yEAo5ZQIbFqNq6M3omLoBw_7b5hyrdS',
    {
      cookies: {
        getAll() {
          return request?.cookies?.getAll?.() || [];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request?.cookies?.set?.(name, value));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return { supabaseResponse, user };
}
