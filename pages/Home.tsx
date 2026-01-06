import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Heart, Loader2 } from 'lucide-react';
import { letterService } from '../services/letterService'; 

// CONFIGURAÇÃO DOS PERFIS (Cores ajustadas para consistência)
const PROFILES = {
  nana: {
    name: 'nana',
    image: 'https://i.imgur.com/SjjQo8L_d.webp?maxwidth=760&fidelity=grand',
    color: 'text-cozy-clay',
    bgColor: 'bg-cozy-clay/10',
    borderColor: 'border-cozy-clay/30'
  },
  fefe: {
    name: 'fefe',
    image: 'https://i.imgur.com/zkL4pkx_d.webp?maxwidth=760&fidelity=grand',
    color: 'text-cozy-sageDark',
    bgColor: 'bg-cozy-sageDark/10', // Alterado para sageDark/10 para consistência
    borderColor: 'border-cozy-sageDark/30'
  }
};

const Letters: React.FC = () => {
  const navigate = useNavigate();
  const [letters, setLetters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await letterService.getLetters();
        setLetters(data || []);
      } catch (err) {
        console.error('Erro ao buscar cartas:', err);
        setError('Não foi possível carregar as cartas');
        setLetters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLetters();
  }, []);

  // Estado de carregamento
  if (loading) {
    return (
      <div className="min-h-screen px-6 pt-safe-top flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-cozy-sage animate-spin mb-4" />
        <p className="text-cozy-sageDark font-serif">carregando cartas...</p>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="min-h-screen px-6 pt-safe-top flex flex-col items-center justify-center">
        <div className="text-center">
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

  // Estado vazio
  if (letters.length === 0) {
    return (
      <div className="min-h-screen px-6 pt-safe-top">
        <div className="flex justify-between items-center mb-8 pt-6">
          <div>
             <p className="text-cozy-sageDark text-sm font-bold tracking-wider mb-1">nana & fefe</p>
             <h1 className="text-3xl font-serif text-cozy-deep font-bold">nossas cartas</h1>
          </div>
          <button 
              onClick={() => navigate('/letter/write')}
              className="w-14 h-14 rounded-full bg-cozy-deep text-white shadow-float flex items-center justify-center hover:bg-cozy-charcoal active:scale-90 transition-all border-4 border-cozy-cream"
          >
              <PenTool size={22} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-5xl mb-4">💌</p>
            <h2 className="text-2xl font-serif text-cozy-deep font-bold mb-2">nenhuma carta ainda</h2>
            <p className="text-cozy-sageDark mb-8">comece a escrever para eternizar seus sentimentos.</p>
            <button 
              onClick={() => navigate('/letter/write')}
              className="px-8 py-3 bg-cozy-deep text-white rounded-full font-bold hover:bg-cozy-charcoal transition-colors shadow-lg"
            >
              escrever primeira carta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pt-safe-top">
      <div className="flex justify-between items-center mb-8 pt-6">
        <div>
           <p className="text-cozy-sageDark text-sm font-bold tracking-wider mb-1">nana & fefe</p>
           <h1 className="text-3xl font-serif text-cozy-deep font-bold">nossas cartas</h1>
        </div>
        <button 
            onClick={() => navigate('/letter/write')}
            className="w-14 h-14 rounded-full bg-cozy-deep text-white shadow-float flex items-center justify-center hover:bg-cozy-charcoal active:scale-90 transition-all border-4 border-cozy-cream"
        >
            <PenTool size={22} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-24">
        {letters.map((letter) => {
          const isEternized = letter.likes >= 2;
          const authorProfile = PROFILES[letter.author_id as keyof typeof PROFILES];
          
          return (
            <div 
                key={letter.id} 
                onClick={() => navigate(`/letter/read/${letter.id}`, { state: { likes: letter.likes, author: letter.author_id } })}
                className="group relative cursor-pointer h-full"
            >
                {/* Visual Layer - Glow Effect for Eternized */}
                {isEternized && (
                    <div className="absolute inset-0 rounded-[2.5rem] bg-cozy-clay/20 blur-xl transform translate-y-4 scale-95 opacity-60 animate-pulse-slow"></div>
                )}
                
                <div className={`absolute inset-0 rounded-[2.5rem] transform translate-y-2 transition-transform ${isEternized ? 'bg-cozy-clay/10' : 'bg-white shadow-sm'}`}></div>
                
                {/* Main Card */}
                <div className={`relative p-5 rounded-[2.5rem] shadow-soft transition-all duration-300 active:scale-[0.98] border h-full
                    ${isEternized 
                        ? 'bg-gradient-to-br from-white via-[#FFF5F5] to-white border-cozy-clay/40 shadow-[0_0_20px_rgba(229,152,155,0.2)]' 
                        : 'bg-white border-transparent'
                    }`}
                >
                    
                    <div className="flex items-start gap-4">
                        {/* Avatar do Autor */}
                        <div className="relative">
                            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 p-0.5 ${isEternized ? 'border-cozy-clay ring-2 ring-cozy-clay/20' : 'border-cozy-sand'}`}>
                                <img 
                                    src={authorProfile?.image} 
                                    alt={authorProfile?.name} 
                                    className="w-full h-full object-cover rounded-full"
                                    // @ts-ignore
                                    fetchpriority="high"
                                />
                            </div>
                            {isEternized && (
                                <div className="absolute -bottom-1 -right-1 bg-cozy-clay text-white p-1 rounded-full border-2 border-white shadow-sm scale-110">
                                    <Heart size={8} fill="currentColor" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-lg font-bold font-serif ${authorProfile?.color}`}>
                                    {authorProfile?.name}
                                </span>
                                <span className="text-xs font-bold text-cozy-sageLight/80">
                                  {new Date(letter.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                            
                            <p className="text-cozy-deep/70 font-serif italic truncate text-base leading-relaxed">
                                "{letter.preview || letter.content?.substring(0, 50)}..."
                            </p>

                            <div className="mt-3 flex items-center gap-2">
                                <span className={`text-[10px] font-bold tracking-widest uppercase py-1 px-3 rounded-full transition-colors ${isEternized ? 'bg-cozy-clay text-white shadow-sm' : 'bg-cozy-sand/30 text-cozy-sageDark'}`}>
                                    {isEternized ? 'eternizada' : 'não lida'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Letters;