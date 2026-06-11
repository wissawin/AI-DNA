-- Run this in the Supabase SQL Editor
-- Project: ievryzyusznpgfbpsput

-- 1. Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  name        text,
  email       text,
  problem_id  text,
  impact_id   text,
  profile_key text,
  card_url    text
);

-- 2. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to read profiles (for the shareable page)
CREATE POLICY "public read profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- 4. Allow anyone to insert (participants submitting their profile)
CREATE POLICY "public insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- NOTE: Also make sure the 'dna-cards' storage bucket is set to PUBLIC.
-- Go to Storage → dna-cards → (bucket settings) → toggle "Public bucket" ON.
