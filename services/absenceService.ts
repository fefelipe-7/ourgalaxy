import { supabase, Absence } from '../lib/supabaseClient';

export const absenceService = {
  async getAbsences() {
    const { data, error } = await supabase
      .from('absences')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Absence[];
  },

  async createAbsence(text: string, authorId: string) {
    const { data, error } = await supabase
      .from('absences')
      .insert([{ text, author_id: authorId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
