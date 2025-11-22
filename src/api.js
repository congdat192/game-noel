import { supabase } from './supabaseClient';

/**
 * Fetches the current user's profile from the 'profiles' table.
 * @returns {Promise<object|null>} The user profile data or null if not found.
 */
export const getProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
};

/**
 * Decrements the number of plays left for the current user.
 * @returns {Promise<object|null>} The result of the operation.
 */
export const decrementPlaysLeft = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Using RPC is safer for decrements to avoid race conditions.
  const { error } = await supabase.rpc('decrement_plays');
  
  if (error) {
    console.error('Error decrementing plays:', error);
    return { error };
  }
  return { success: true };
};

// NOTE: You need to create the `decrement_plays` function in your Supabase SQL Editor:
/*
  CREATE OR REPLACE FUNCTION decrement_plays()
  RETURNS void AS $$
  BEGIN
    UPDATE public.profiles
    SET plays_left = plays_left - 1
    WHERE id = auth.uid() AND plays_left > 0;
  END;
  $$ LANGUAGE plpgsql;
*/

/**
 * Saves the result of a game play.
 * @param {number} finalScore The score achieved in the game.
 * @param {string|null} voucherCode The generated voucher code.
 * @returns {Promise<object|null>} The result of the operation.
 */
export const saveGameResult = async (finalScore, voucherCode) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Log the game play
  const { error: gamePlayError } = await supabase
    .from('game_plays')
    .insert({ user_id: user.id, score: finalScore, voucher_code: voucherCode });

  if (gamePlayError) {
    console.error('Error saving game play:', gamePlayError);
    return { error: gamePlayError };
  }

  // 2. Update the user's total score (using an RPC function is safer for increments)
  // For simplicity here, we fetch and update. For production, a Supabase function is recommended.
  const { error: rpcError } = await supabase.rpc('update_total_score', {
    increment_score: finalScore
  });

  if (rpcError) {
    console.error('Error updating total score:', rpcError);
    return { error: rpcError };
  }

  return { success: true };
};

/**
 * Checks if the user's free daily plays should be reset and resets them if needed.
 * @param {object} profile The user's profile data.
 * @param {number} dailyFreePlays The number of free plays per day from config.
 * @returns {Promise<boolean>} True if plays were reset, false otherwise.
 */
export const resetDailyPlaysIfNeeded = async (profile, dailyFreePlays) => {
  if (!profile) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today in local time

  const lastPlayedAt = profile.last_played_at ? new Date(profile.last_played_at) : null;
  
  if (!lastPlayedAt || lastPlayedAt < today) {
    const { error } = await supabase
      .from('profiles')
      .update({ plays_left: dailyFreePlays, last_played_at: new Date().toISOString() })
      .eq('id', profile.id);
    
    if (error) {
      console.error('Error resetting daily plays:', error);
      return false;
    }
    console.log('Daily plays have been reset.');
    return true;
  }

  return false;
};


// NOTE: You need to create the `update_total_score` function in your Supabase SQL Editor:
/*
  CREATE OR REPLACE FUNCTION update_total_score(increment_score INT)
  RETURNS void AS $$
  BEGIN
    UPDATE public.profiles
    SET total_score = total_score + increment_score
    WHERE id = auth.uid();
  END;
  $$ LANGUAGE plpgsql;
*/
