import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Dream = {
  id: string;
  user_id: string;
  dream_content: string;
  mood: string;
  analysis: string;
  created_at: string;
  updated_at: string;
};
