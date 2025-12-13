-- EMERGENCY FIX SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR
-- This script temporarily disables strict checks to allow SignUp to proceed.

-- 1. Temporarily Disable RLS (to rule out permission errors)
ALTER TABLE public.company_profiles DISABLE ROW LEVEL SECURITY;

-- 2. Drop the existing trigger (It is the likely cause of the 500 Error)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Ensure the FK column exists
ALTER TABLE public.company_profiles 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Create a "Safe" Trigger that SWALLOWS errors
-- This ensures that even if profile creation fails, the User Account is still created.
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Try to insert with minimal fields
  INSERT INTO public.company_profiles (user_id, owner_name, profile_slug)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    'user-' || substring(NEW.id::text, 1, 8)
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- If it fails (e.g. missing column, constraint violation), DO NOTHING.
  -- This allows the SignUp to succeed (200 OK).
  -- You can then check the Database logs to see why the profile verify failed.
  RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Re-enable Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Re-enable RLS (Permissive for now to avoid blocks)
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access" ON public.company_profiles;
CREATE POLICY "Public access" ON public.company_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "User update own" ON public.company_profiles;
CREATE POLICY "User update own" ON public.company_profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User insert own" ON public.company_profiles;
CREATE POLICY "User insert own" ON public.company_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
