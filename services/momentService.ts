import { supabase, Moment } from '../lib/supabaseClient';

// Função auxiliar para compressão de imagem no navegador
const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Reduzido de 1200 para 1024 para melhorar performance em celulares
        const MAX_WIDTH = 1024; 
        const scaleSize = MAX_WIDTH / img.width;
        
        // Se a imagem for menor que o máximo, não redimensiona, apenas comprime qualidade
        const width = scaleSize < 1 ? MAX_WIDTH : img.width;
        const height = scaleSize < 1 ? img.height * scaleSize : img.height;

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
           reject(new Error('Canvas context not available'));
           return;
        }
        
        // Melhora a qualidade da renderização no canvas
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Comprime para JPEG com 75% de qualidade (bom equilíbrio)
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Compression failed'));
        }, 'image/jpeg', 0.75);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const momentService = {
  async getMoments() {
    const { data, error } = await supabase
      .from('moments')
      .select('*')
      .order('date_memory', { ascending: false });
    
    if (error) throw error;
    return data as Moment[];
  },

  async getMomentById(id: string | number) {
    const { data, error } = await supabase
      .from('moments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Moment;
  },

  async createMoment(
    file: File, 
    metadata: { 
      date: string; 
      time?: string; 
      description: string; 
      author_id: string 
    }
  ) {
    const isImage = file.type.startsWith('image/');
    let fileToUpload: File | Blob = file;
    let fileExt = file.name.split('.').pop();
    let mimeType = file.type;

    // 1. Comprimir se for imagem
    if (isImage) {
      try {
        fileToUpload = await compressImage(file);
        fileExt = 'jpg'; // Forçamos jpg na compressão
        mimeType = 'image/jpeg';
      } catch (e) {
        console.warn('Falha na compressão, enviando original', e);
      }
    }

    // 2. Upload para Storage
    // Usar Date.now() simples evita colisões suficientes para este caso
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('moments-media')
      .upload(fileName, fileToUpload, {
        contentType: mimeType,
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 3. Obter URL Pública
    const { data: { publicUrl } } = supabase.storage
      .from('moments-media')
      .getPublicUrl(fileName);

    // 4. Salvar no Banco
    const { data, error: dbError } = await supabase
      .from('moments')
      .insert([{
        date_memory: metadata.date,
        time_memory: metadata.time || null,
        description: metadata.description,
        media_url: publicUrl,
        media_type: isImage ? 'image' : 'video',
        author_id: metadata.author_id
      }])
      .select()
      .single();

    if (dbError) throw dbError;
    return data;
  }
};