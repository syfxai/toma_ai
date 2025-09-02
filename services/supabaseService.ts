import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kwlsvdnzpndkwcqaejep.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bHN2ZG56cG5ka3djcWFlamVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzQyNDgsImV4cCI6MjA3MjMxMDI0OH0.P2j0GOBYSRvuF-Og93o3ONGU5C2mPNmyTBMCGldUy-A';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getUserId = (): string => {
  let userId = localStorage.getItem('toma_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('toma_user_id', userId);
  }
  return userId;
};

export const recordGeneration = async (): Promise<void> => {
  try {
    const userId = getUserId();
    const { error } = await supabase
      .from('toma_interactions')
      .insert({ user_id: userId });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error recording generation:', error);
    // Fail silently so the user experience is not interrupted
  }
};

export const getGenerationCount = async (): Promise<number | null> => {
  try {
    const { count, error } = await supabase
      .from('toma_interactions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }
    
    return count;
  } catch (error) {
    console.error('Error fetching generation count:', error);
    return null;
  }
};