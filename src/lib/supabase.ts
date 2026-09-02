import { SupabaseClient, User, Session } from '@supabase/supabase-js';
import { supabase as clientInstance } from '../supabaseClient.js';
import { PortfolioData } from '../types';

export const supabaseUrl = "https://glhowtmwkgzylfoglwhy.supabase.co";
export const supabaseAnonKey = "sb_publishable_yEAo5ZQIbFqNq6M3omLoBw_7b5hyrdS";

export const isSupabaseConfigured = (): boolean => true;

export const supabase: SupabaseClient | any = clientInstance;

/**
 * Authentication Helpers
 */

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please check your .env credentials.');
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || 'Tech Humans Creator',
        },
      },
    });

    if (error) {
      if (error.message.includes('captcha') || error.message.includes('captcha_token')) {
        throw new Error('Captcha Protection is enabled on your Supabase project. To disable it: Go to Supabase Dashboard -> Authentication -> Security -> Disable "CAPTCHA protection".');
      }
      if (error.message.includes('rate limit') || (error as any).code === 'over_email_send_rate_limit') {
        throw new Error('Supabase email confirmation rate limit reached. In Supabase Dashboard -> Authentication -> Providers -> Email, you can disable "Confirm email" for instant password signups.');
      }
      if ((error as any).code === 'email_address_invalid') {
        throw new Error('Please enter a valid email address with standard domain.');
      }
      throw error;
    }
    return data;
  } catch (err: any) {
    throw err;
  }
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please check your .env credentials.');
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('captcha') || error.message.includes('captcha_token')) {
        throw new Error('Captcha Protection is enabled on your Supabase project. To disable it: Go to Supabase Dashboard -> Authentication -> Security -> Disable "CAPTCHA protection".');
      }
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. If you are creating a new account, please switch to the "Sign Up" tab first.');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Your email has not been confirmed yet. Please check your email inbox or disable email confirmation in your Supabase Dashboard.');
      }
      throw error;
    }
    return data;
  } catch (err: any) {
    throw err;
  }
}

export async function signInWithOAuth(provider: 'google' | 'github') {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) console.warn('Supabase signOut error:', error.message);
}

export async function getSupabaseSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn('Error fetching Supabase session:', error.message);
    return null;
  }
  return data.session;
}

export async function getSupabaseUser(): Promise<User | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

/**
 * Cloud Database (portfolios table) Helpers
 */

export interface CloudPortfolioRecord {
  id?: string;
  user_id?: string;
  slug: string;
  title: string;
  data: PortfolioData;
  updated_at?: string;
  created_at?: string;
}

/**
 * Save / Upsert user's portfolio into Supabase 'portfolios' table
 */
function isMissingRelationError(error: { code?: string; message: string }): boolean {
  return (
    error.code === 'PGRST205' ||
    error.message.includes('schema cache') ||
    error.message.includes('does not exist')
  );
}

function toValidUUID(str: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) {
    return str;
  }
  
  // Otherwise, hash the string to generate a deterministic UUID format
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  
  const absHash = Math.abs(hash).toString(16).padStart(8, '0');
  const pad = '1234567890abcdef1234567890abcdef';
  const fullHex = (absHash + pad).slice(0, 32);
  
  return `${fullHex.slice(0, 8)}-${fullHex.slice(8, 12)}-4${fullHex.slice(12, 15)}-a${fullHex.slice(15, 18)}-${fullHex.slice(18, 30)}`;
}

async function requireSignedInUser(userId?: string) {
  if (!supabase) {
    return { user: null, error: 'Supabase client not initialized' };
  }
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user) {
      return { user: sessionData.session.user, error: null };
    }

    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      return { user: data.user, error: null };
    }

    // Fallback: If not authenticated with Supabase Auth, allow saving under guest UUID
    return { user: { id: userId || '00000000-0000-4000-a000-000000000000' }, error: null };
  } catch (err: any) {
    return { user: { id: '00000000-0000-4000-a000-000000000000' }, error: null };
  }
}

export async function savePortfolioToSupabase(
  portfolio: PortfolioData,
  userId?: string
): Promise<{ success: boolean; data?: any; error?: string; isSchemaMissing?: boolean }> {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }

  try {
    const { user, error: authError } = await requireSignedInUser(userId);
    if (!user) {
      return { success: false, error: authError || 'Sign in to save to Supabase.' };
    }

    const payload = {
      slug: portfolio.slug || 'my-portfolio',
      title: `${portfolio.profile.fullName}'s Portfolio`,
      user_id: toValidUUID(user.id),
      data: portfolio,
      updated_at: new Date().toISOString(),
    };

    // Attempt upsert on portfolios table
    const { data, error } = await supabase
      .from('portfolios')
      .upsert(payload, { onConflict: 'slug' })
      .select();

    if (error) {
      if (isMissingRelationError(error)) {
        console.warn('Supabase schema notice: Table "public.portfolios" has not been created yet.');
        return { 
          success: false, 
          isSchemaMissing: true,
          error: 'Table "portfolios" not found in Supabase database. Please run supabase_schema.sql in the Supabase SQL Editor.' 
        };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Error saving portfolio to Supabase:', err);
    return { success: false, error: err.message || 'Unknown database error' };
  }
}

/**
 * Fetch portfolio by slug from Supabase
 */
export async function fetchPortfolioBySlug(
  slug: string
): Promise<{ success: boolean; data?: PortfolioData; error?: string; isSchemaMissing?: boolean }> {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }

  try {
    const cleanSlug = (slug || '').trim();
    let { data, error } = await supabase
      .from('portfolios')
      .select('data')
      .ilike('slug', cleanSlug)
      .limit(1)
      .maybeSingle();

    if (!data) {
      const res = await supabase
        .from('portfolios')
        .select('data')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      data = res.data;
    }

    if (data && data.data) {
      return { success: true, data: data.data as PortfolioData };
    }

    return { success: false, error: 'Portfolio not found' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch latest user's portfolio from Supabase
 */
export async function fetchUserPortfolio(
  userId?: string
): Promise<{ success: boolean; data?: PortfolioData; error?: string; isSchemaMissing?: boolean }> {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }

  try {
    const { user } = await requireSignedInUser(userId);
    if (user) {
      const { data, error } = await supabase
        .from('portfolios')
        .select('data')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && data.data) {
        return { success: true, data: data.data as PortfolioData };
      }
    }

    // Fallback: Fetch latest portfolio record in database
    const { data: latest } = await supabase
      .from('portfolios')
      .select('data')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latest && latest.data) {
      return { success: true, data: latest.data as PortfolioData };
    }

    return { success: false, error: 'No portfolio found for user' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Storage Helpers: Upload resume PDF or image to Supabase Storage
 */
export async function uploadResumeToSupabase(
  file: File,
  userId?: string
): Promise<{ success: boolean; publicUrl?: string; error?: string; isBucketMissing?: boolean }> {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }

  try {
    // Resolve user ID from passed param or active session, fall back to 'anon'
    let resolvedUserId = userId;
    if (!resolvedUserId) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        resolvedUserId = sessionData?.session?.user?.id;
      } catch { /* ignore */ }
    }
    const folderName = resolvedUserId || 'anon';

    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${folderName}/${timestamp}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      if ((error as any).code === 'NoSuchBucket' || error.message.includes('Bucket not found')) {
        console.warn('Supabase Storage notice: "resumes" bucket not created yet.');
        return { 
          success: false, 
          isBucketMissing: true, 
          error: 'Storage bucket "resumes" does not exist in Supabase yet. Run supabase_schema.sql to create it.' 
        };
      }
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(path);

    return { success: true, publicUrl: urlData.publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Save Contact message to Supabase 'messages' table
 */
export async function saveContactMessageToSupabase(message: {
  name: string;
  email: string;
  message: string;
  portfolio_slug?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }

  try {
    if (!message.portfolio_slug) {
      return { success: false, error: 'portfolio_slug is required' };
    }

    const { error } = await supabase.from('messages').insert({
      name: message.name,
      email: message.email,
      message: message.message,
      portfolio_slug: message.portfolio_slug,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Supabase messages insert notice:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown database error' };
  }
}

/**
 * Comprehensive Supabase Backend Health Diagnostic
 */
export async function checkSupabaseBackendHealth(): Promise<{
  isConnected: boolean;
  projectUrl: string;
  hasPortfoliosTable: boolean;
  hasMessagesTable: boolean;
  hasResumesBucket: boolean;
  errorDetails?: string;
}> {
  if (!supabase) {
    return {
      isConnected: false,
      projectUrl: '',
      hasPortfoliosTable: false,
      hasMessagesTable: false,
      hasResumesBucket: false,
      errorDetails: 'Supabase credentials are not configured in .env',
    };
  }

  let hasPortfoliosTable = false;
  let hasMessagesTable = false;
  let hasResumesBucket = false;
  let isConnected = true;

  try {
    // 1. Check portfolios table
    const { error: portErr } = await supabase.from('portfolios').select('id').limit(1);
    hasPortfoliosTable = !portErr || !isMissingRelationError(portErr);

    // 2. Check messages table (anon SELECT is denied after RLS lockdown)
    const { error: msgErr } = await supabase.from('messages').select('id').limit(1);
    hasMessagesTable = !msgErr || !isMissingRelationError(msgErr);

    // 3. Check resumes bucket
    const { data: bucketData, error: bucketErr } = await supabase.storage.getBucket('resumes');
    if (!bucketErr && bucketData) {
      hasResumesBucket = true;
    }
  } catch (e: any) {
    isConnected = false;
  }

  return {
    isConnected,
    projectUrl: supabaseUrl,
    hasPortfoliosTable,
    hasMessagesTable,
    hasResumesBucket,
  };
}
