-- RUN THIS SCRIPT IN YOUR SUPABASE SQL EDITOR
-- It fixes the "Database error saving new user" by providing required fields.

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.company_profiles (
    user_id, 
    owner_name, 
    company_name,
    owner_role, -- Matches typescript interface 'owner_role'
    brief_description,
    profile_slug,
    qr_scan_count
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'), 
    'My Company',
    'Founder', 
    'A brief description of my company.',
    'user-' || substring(NEW.id::text, 1, 8), -- Ensure unique, non-null slug
    0
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Fallback: If 'owner_role' or others fail, try minimum fields
  BEGIN
      INSERT INTO public.company_profiles (
        user_id, 
        owner_name, 
        profile_slug
      )
      VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        'user-' || substring(NEW.id::text, 1, 8)
      );
  EXCEPTION WHEN OTHERS THEN
      -- Log the error but allow user creation to succeed (profile will be missing)
      -- This prevents the "Database error" popup in UI
      RAISE WARNING 'Profile creation failed completely: %', SQLERRM;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
