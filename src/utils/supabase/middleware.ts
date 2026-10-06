import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: any) {
  let supabaseResponse = { headers: new Headers() };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request?.cookies?.getAll?.() || [];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request?.cookies?.set?.(name, value));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  return { supabaseResponse, user };
}
