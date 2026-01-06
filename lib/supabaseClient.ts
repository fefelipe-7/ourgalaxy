import { createClient } from '@supabase/supabase-js';

// CREDENCIAIS FORNECIDAS
const supabaseUrl = 'https://jbwqbfjrnjcfezijwets.supabase.co';
const supabaseKey = 'sb_publishable_baKgxZ7HHjCO7ET5qtLZuA_d7cR8DiU';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Profile = {
  id: string; // 'nana' | 'fefe'
  name: string;
  avatar_url: string;
};

// Definições de tipos básicos para TypeScript
export type Letter = {
  id: number;
  created_at: string;
  content: string;
  author_id: string;
  recipient_id: string;
  likes: number; // 0, 1 (autor), 2 (eternizada)
  preview?: string; 
};

export type Absence = {
  id: number;
  created_at: string;
  text: string;
  author_id: string;
};

export type Moment = {
  id: number;
  created_at: string;
  date_memory: string;
  time_memory?: string;
  description: string;
  media_url: string;
  media_type: 'image' | 'video';
  author_id: string;
};
