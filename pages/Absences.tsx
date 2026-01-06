import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Heart, X, Wind, Loader2 } from 'lucide-react';
import { absenceService } from '../services/absenceService';

// Formas orgânicas ajustadas para maior fluidez visual
const BLOB_SHAPES = [
  '45% 55% 40% 60% / 55% 45% 55% 45%', // Mais arredondado
  '60% 40% 55% 45% / 40% 55% 45% 55%', // Levemente oval
  '50% 50% 45% 55% / 55% 45% 55% 45%', // Quase círculo
  '55% 45% 60% 40% / 45% 55% 40% 60%', // Assimétrico suave
];

// Animações de flutuação CSS
const FLOAT_CLASSES = [
  'animate-float-slow',
  'animate-float-medium',
  'animate-float-fast'
];

const Absences: React.FC = () => {
  const [newAbsence, setNewAbsence] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [absences, setAbsences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await absenceService.getAbsences();
        setAbsences(data || []);
      } catch (err) {
        console.error('Erro ao buscar saudades:', err);
        setError('Não foi possível carregar as saudades');
        setAbsences([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAbsences();
  }, []);

  const handleAdd = async () => {
    if (!newAbsence.trim()) return;
    
    try {
      setSubmitting(true);
      const authorId = 'fefe'; // Você pode alterar isso conforme necessário
      const newItem = await absenceService.createAbsence(newAbsence, authorId);
      setAbsences([newItem, ...absences]);
      setNewAbsence('');
    } catch (err) {
      console.error('Erro ao criar saudade:', err);
      alert('Não foi possível salvar a saudade');
    } finally {
      setSubmitting(false);
    }
  };

  // Memoriza os estilos visuais de cada item
  const itemsWithStyle = useMemo(() => {
    return absences.map((item, i) => {
        const seed = item.id; 
        const shapeIndex = seed % BLOB_SHAPES.length;
        const floatIndex = seed % FLOAT_CLASSES.length;
        
        // Tamanhos ligeiramente maiores para toque mais fácil
        const size = 110 + (seed % 50); // 110px a 160px
        
        // Offset reduzido para manter mais centralizado visualmente
        const offsetX = (seed % 20) - 10; 
        const offsetY = ((seed * 2) % 20) - 10;
        
        const bgColor = item.type === 'miss' ? 'bg-white' : 'bg-[#FDFBF7]';

        return {
            ...item,
            style: {
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: BLOB_SHAPES[shapeIndex],
                transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`, // Translate3d força GPU
            },
            className: `${bgColor} ${FLOAT_CLASSES[floatIndex]} will-change-transform`, // will-change otimiza renderização
        };
    });
  }, [absences]);

  // Estado de carregamento
  if (loading) {
    return (
      <div className="h-full w-full bg-cozy-cream relative flex flex-col items-center justify-center pt-safe-top">
        <Loader2 size={40} className="text-cozy-sage animate-spin mb-4" />
        <p className="text-cozy-sageDark font-serif">carregando saudades...</p>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="h-full w-full bg-cozy-cream relative flex flex-col items-center justify-center pt-safe-top">
        <div className="text-center px-6">
          <p className="text-cozy-clay text-lg font-serif mb-4">⚠️</p>
          <p className="text-cozy-deep font-serif font-bold mb-2">Oops!</p>
          <p className="text-cozy-sageDark text-sm mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-cozy-deep text-white rounded-full text-sm font-bold hover:bg-cozy-charcoal transition-colors"
          >
            tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-cozy-cream relative flex flex-col pt-safe-top">
      
      {/* 1. Input Area Fixa */}
      <div className="z-30 px-6 pt-8 pb-6 bg-cozy-cream shadow-[0_10px_40px_-10px_rgba(249,247,242,1)] sticky top-0">
        <div className="flex justify-between items-end mb-4">
            <div>
                <h1 className="text-3xl font-serif text-cozy-deep font-bold leading-none">saudades</h1>
                <p className="text-cozy-sageDark text-sm mt-1 flex items-center gap-2">
                    <Wind size={14} className="animate-pulse" />
                    ecos da sua presença.
                </p>
            </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-1.5 pl-5 shadow-soft border border-cozy-sageLight/10 flex items-center gap-3 transition-all focus-within:shadow-lg focus-within:border-cozy-sage/30">
            <input 
                type="text" 
                placeholder="do que sentiu saudade hoje?" 
                className="flex-1 bg-transparent text-cozy-deep outline-none placeholder-cozy-sageLight/70 font-serif h-12 text-lg"
                value={newAbsence}
                onChange={(e) => setNewAbsence(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                disabled={submitting}
            />
            <button 
                onClick={handleAdd}
                disabled={!newAbsence || submitting}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out ${newAbsence && !submitting ? 'bg-cozy-deep text-white rotate-0 shadow-md' : 'bg-transparent text-cozy-sageLight/30 rotate-90'}`}
            >
                {submitting ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Plus size={24} strokeWidth={newAbsence ? 2 : 1.5} />
                )}
            </button>
        </div>
      </div>

      {/* 2. O Éter (Container de Scroll) */}
      <div className="flex-1 p-4 pb-32">
         {absences.length === 0 ? (
           <div className="flex flex-col items-center justify-center min-h-[50vh]">
             <div className="text-center">
               <p className="text-5xl mb-4">💭</p>
               <h2 className="text-2xl font-serif text-cozy-deep font-bold mb-2">nenhuma saudade ainda</h2>
               <p className="text-cozy-sageDark">compartilhe seus sentimentos acima.</p>
             </div>
           </div>
         ) : (
           <div className="flex flex-wrap justify-center gap-6 py-8 content-start min-h-[50vh]">
             {itemsWithStyle.map((item) => (
                 <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`relative group cursor-pointer transition-transform duration-300 active:scale-95 outline-none`}
                    style={{
                        width: item.style.width,
                        height: item.style.height,
                        margin: '-8px', // Leve sobreposição para visual orgânico
                    }}
                 >
                     <div 
                        className={`absolute inset-0 shadow-sm border border-cozy-sageLight/10 backdrop-blur-[2px] ${item.className} group-hover:shadow-glow transition-shadow duration-500`}
                        style={{
                            borderRadius: item.style.borderRadius,
                            // Transform aplicado via classe CSS (float) + ajuste fino inline
                        }}
                     >
                         <div className="absolute inset-0 flex items-center justify-center p-5 overflow-hidden">
                             <p className="text-[11px] text-cozy-deep/70 font-serif text-center font-medium leading-tight line-clamp-3 italic opacity-80 group-hover:opacity-100 transition-opacity">
                                 {item.text}
                             </p>
                         </div>
                     </div>
                 </button>
             ))}
             
             {/* Espaço extra no final */}
             <div className="w-full h-24"></div>
           </div>
         )}
      </div>

      {/* 3. Modal de Visualização */}
      {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
              <div 
                className="absolute inset-0 bg-cozy-deep/20 backdrop-blur-md transition-opacity animate-fade-in"
                onClick={() => setSelectedItem(null)}
              ></div>

              <div className="bg-white relative z-10 w-full max-w-sm rounded-[3rem] p-8 shadow-2xl animate-slide-up border border-white/50">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-6 right-6 text-cozy-sageLight hover:text-cozy-deep transition-colors p-2"
                  >
                      <X size={24} />
                  </button>

                  <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-cozy-cream flex items-center justify-center text-cozy-clay mb-6 shadow-inner">
                          <Heart size={28} className="fill-current animate-pulse-slow" />
                      </div>
                      
                      <span className="text-xs font-bold text-cozy-sageDark uppercase tracking-widest mb-4 bg-cozy-sand/30 px-3 py-1 rounded-full">
                          {selectedItem.date}
                      </span>

                      <p className="text-2xl font-serif text-cozy-deep leading-relaxed italic mb-8">
                          "{selectedItem.text}"
                      </p>
                      
                      <p className="text-xs text-cozy-sageLight font-bold">
                          guardado no coração.
                      </p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Absences;