-- Wallet Feature Setup

-- 1. Create the table to store saved cards
CREATE TABLE IF NOT EXISTS public.saved_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid (),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  saved_profile_id UUID NOT NULL REFERENCES public.company_profiles (id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT saved_cards_pkey PRIMARY KEY (id),
  CONSTRAINT saved_cards_user_profile_unique UNIQUE (user_id, saved_profile_id)
);

-- 2. Enable RLS
ALTER TABLE public.saved_cards ENABLE ROW LEVEL SECURITY;

-- 3. Policies

-- View: Users can see only their own wallet
DROP POLICY IF EXISTS "Users can view their own saved cards" ON public.saved_cards;
CREATE POLICY "Users can view their own saved cards"
ON public.saved_cards FOR SELECT
USING (auth.uid() = user_id);

-- Insert: Users can add to their own wallet
DROP POLICY IF EXISTS "Users can add cards to their wallet" ON public.saved_cards;
CREATE POLICY "Users can add cards to their wallet"
ON public.saved_cards FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Delete: Users can remove from their own wallet
DROP POLICY IF EXISTS "Users can remove cards from their wallet" ON public.saved_cards;
CREATE POLICY "Users can remove cards from their wallet"
ON public.saved_cards FOR DELETE
USING (auth.uid() = user_id);
