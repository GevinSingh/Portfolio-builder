-- ==============================================================================
-- Tech Humans Portfolio - Master Supabase Database Schema & Storage Setup
-- Project URL: https://glhowtmwkgzylfoglwhy.supabase.co
--
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/glhowtmwkgzylfoglwhy
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "+ New query", paste this entire script, and click "Run" (Ctrl+Enter / Cmd+Enter)
-- ==============================================================================

-- ==============================================================================
-- 1. PORTFOLIOS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    data JSONB NOT NULL,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Drop foreign key constraint so local/Express users can also save portfolios
ALTER TABLE public.portfolios DROP CONSTRAINT IF EXISTS portfolios_user_id_fkey;

-- Index for fast lookup by slug and updated_at
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON public.portfolios (slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_updated_at ON public.portfolios (updated_at DESC);

-- Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.set_portfolios_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER trg_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.set_portfolios_updated_at();

-- Enable Row Level Security
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Public can view all portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Anyone can create or upsert portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Anyone can update portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Anyone can delete portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Owners can insert portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Owners can update portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Owners can delete portfolios" ON public.portfolios;

-- Permissive, seamless policies for portfolios
CREATE POLICY "Public can view all portfolios"
  ON public.portfolios FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create or upsert portfolios"
  ON public.portfolios FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update portfolios"
  ON public.portfolios FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete portfolios"
  ON public.portfolios FOR DELETE
  TO anon, authenticated
  USING (true);

-- ==============================================================================
-- 2. CONTACT MESSAGES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_slug_created
  ON public.messages (portfolio_slug, created_at DESC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can send a contact message" ON public.messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.messages;
DROP POLICY IF EXISTS "Owners can read their contact messages" ON public.messages;

CREATE POLICY "Anyone can insert contact messages"
  ON public.messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read messages"
  ON public.messages FOR SELECT
  TO anon, authenticated
  USING (true);

-- ==============================================================================
-- 3. STORAGE BUCKETS & POLICIES (Resumes & Avatars)
-- ==============================================================================
-- Ensure buckets exist and are public
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Clean up old storage policies
DROP POLICY IF EXISTS "Public resumes access" ON storage.objects;
DROP POLICY IF EXISTS "Public resumes upload" ON storage.objects;
DROP POLICY IF EXISTS "Public resumes update" ON storage.objects;
DROP POLICY IF EXISTS "Public can read resume and avatar files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload resume and avatar files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update resume and avatar files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete resume and avatar files" ON storage.objects;
DROP POLICY IF EXISTS "Owners can upload resume and avatar files" ON storage.objects;
DROP POLICY IF EXISTS "Owners can update own resume and avatar files" ON storage.objects;
DROP POLICY IF EXISTS "Owners can delete own resume and avatar files" ON storage.objects;

-- Allow EVERYONE (public + app users) to read/download resumes and avatars
CREATE POLICY "Public can read resume and avatar files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('resumes', 'avatars'));

-- Allow uploads into resumes and avatars buckets
CREATE POLICY "Anyone can upload resume and avatar files"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id IN ('resumes', 'avatars'));

-- Allow update & replacement
CREATE POLICY "Anyone can update resume and avatar files"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id IN ('resumes', 'avatars'));

-- Allow file deletion
CREATE POLICY "Anyone can delete resume and avatar files"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id IN ('resumes', 'avatars'));

-- ==============================================================================
-- Schema Setup Complete! All tables, indexes, triggers & storage policies are ready.
-- ==============================================================================
