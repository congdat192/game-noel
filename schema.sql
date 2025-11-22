-- This schema is designed for Supabase.
-- It assumes you are using Supabase's built-in Auth for user management.

-- 1. PROFILES TABLE
-- This table stores public user data and game-specific information.
-- It is linked to the auth.users table.
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  phone_number VARCHAR(15) UNIQUE NOT NULL,
  total_score BIGINT DEFAULT 0 NOT NULL,
  plays_left INT DEFAULT 1 NOT NULL,
  bonus_plays_left INT DEFAULT 0 NOT NULL,
  last_played_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (id)
);

-- Function to create a new profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone_number)
  VALUES (new.id, new.phone);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically call the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security (RLS) for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table:
-- 1. Users can see their own profile.
CREATE POLICY "Users can view their own profile." ON public.profiles
  FOR SELECT USING (auth.uid() = id);
-- 2. Users can update their own profile.
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);


-- 2. GAME PLAYS TABLE
-- This table logs every single game played by a user.
CREATE TABLE public.game_plays (
  id BIGSERIAL PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  score INT NOT NULL,
  voucher_code VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS for game_plays table
ALTER TABLE public.game_plays ENABLE ROW LEVEL SECURITY;

-- Policies for game_plays table:
-- 1. Users can see their own game plays.
CREATE POLICY "Users can view their own game plays." ON public.game_plays
  FOR SELECT USING (auth.uid() = user_id);
-- 2. Users can insert their own game plays.
CREATE POLICY "Users can insert their own game plays." ON public.game_plays
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 3. REFERRALS TABLE
-- This table tracks successful referrals.
CREATE TABLE public.referrals (
  id BIGSERIAL PRIMARY KEY,
  referrer_id uuid NOT NULL REFERENCES public.profiles ON DELETE CASCADE, -- The user who shared the link
  referred_id uuid NOT NULL REFERENCES public.profiles ON DELETE CASCADE, -- The new user who signed up
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (referrer_id, referred_id) -- Ensure a user can only be referred by someone once
);

-- Enable RLS for referrals table
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Policies for referrals table:
-- Users can see referrals they made or referrals that led to them.
CREATE POLICY "Users can view their own referral data." ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
-- Logged-in users can create referrals.
CREATE POLICY "Users can create referrals." ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);
