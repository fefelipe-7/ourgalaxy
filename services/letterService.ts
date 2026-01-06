import { supabase, Letter } from '../lib/supabaseClient';

export const letterService = {
  // Buscar todas as cartas (ordenadas por data)
  async getLetters() {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Letter[];
  },

  // Buscar uma carta específica
  async getLetterById(id: string | number) {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Letter;
  },

  // Enviar uma nova carta
  async sendLetter(content: string, authorId: string, recipientId: string) {
    // Automaticamente começa com 1 like (do autor)
    const { data, error } = await supabase
      .from('letters')
      .insert([
        { 
          content, 
          author_id: authorId, 
          recipient_id: recipientId,
          likes: 1 
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar likes (Eternizar)
  async toggleLike(letterId: number, currentLikes: number) {
    // Lógica simples: se tem 1, vai pra 2. Se tem 2, volta pra 1.
    // Em um app real com auth, verificaríamos quem deu o like.
    const newLikes = currentLikes >= 2 ? 1 : 2;

    const { data, error } = await supabase
      .from('letters')
      .update({ likes: newLikes })
      .eq('id', letterId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
