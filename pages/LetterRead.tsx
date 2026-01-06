import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { X, Heart, Infinity as InfinityIcon } from 'lucide-react';
// import { letterService } from '../services/letterService';

const PROFILES = {
  nana: {
    name: 'nana',
    image: 'https://i.imgur.com/SjjQo8L_d.webp?maxwidth=760&fidelity=grand',
    theme: 'text-cozy-clay'
  },
  fefe: {
    name: 'fefe',
    image: 'https://i.imgur.com/zkL4pkx_d.webp?maxwidth=760&fidelity=grand',
    theme: 'text-cozy-sageDark'
  }
};

const LetterRead: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  const initialLikes = location.state?.likes || 1; 
  const authorKey = (location.state?.author as keyof typeof PROFILES) || 'nana';
  const author = PROFILES[authorKey];

  const [isVisible, setIsVisible] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isEternized, setIsEternized] = useState(initialLikes >= 2);

  useEffect(() => {
    // Exemplo de busca real:
    // letterService.getLetterById(id).then(data => ...);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    setIsEternized(likes >= 2);
  }, [likes]);

  const handleLike = async () => {
    // Exemplo backend:
    // await letterService.toggleLike(Number(id), likes);
    setLikes(likes === 1 ? 2 : 1);
  };

  const getTransitionClass = (delay: string) => 
    `transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${delay}`;

  const themeColor = authorKey === 'nana' ? 'text-cozy-clay' : 'text-cozy-sageDark';

  return (
    <div className="min-h-screen bg-cozy-cream flex flex-col px-6 pt-safe-top pb-12 relative transition-colors duration-1000">
      
      {/* Background Ambience for Eternized */}
      {isEternized && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-cozy-clay/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-cozy-sage/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 pt-4 relative z-10">
         <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-cozy-sageDark bg-cozy-sageLight/30 px-3 py-1 rounded-full tracking-wider">
                12 de outubro
             </span>
             {isEternized && (
                 <span className="animate-fade-in flex items-center gap-1 text-xs font-bold text-cozy-clay bg-white/50 px-3 py-1 rounded-full tracking-wider border border-cozy-clay/20">
                    <InfinityIcon size={12} /> eternizada
                 </span>
             )}
         </div>
         <button 
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-cozy-deep hover:bg-cozy-sand transition-colors active:scale-90"
         >
            <X size={20} />
         </button>
      </div>

      <div className={`flex-1 transition-all duration-1000 ease-out relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className={`bg-white rounded-[2.5rem] p-8 min-h-[65vh] relative overflow-hidden transition-all duration-700 shadow-soft border ${isEternized ? 'border-cozy-clay/30 shadow-glow' : 'border-cozy-sageLight/10'}`}>
            
            {/* Cabeçalho da Carta com Foto - Reduzido de w-20 para w-16 */}
            <div className={`flex flex-col items-center mb-8 ${getTransitionClass('delay-100')}`}>
                <div className="w-16 h-16 rounded-full p-1 bg-white shadow-md mb-3">
                    <img src={author.image} alt={author.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <h2 className={`text-2xl font-serif font-bold ${themeColor}`}>
                    {author.name} escreveu:
                </h2>
            </div>

            <div className="space-y-6 font-serif text-lg leading-loose text-cozy-deep/90 relative z-10 text-center">
                <p className={getTransitionClass('delay-300')}>
                    sobre o que conversamos ontem, fiquei pensando muito no silêncio que ficou entre a gente.
                </p>
                <p className={getTransitionClass('delay-500')}>
                    não acho que precisamos resolver tudo agora. algumas coisas precisam de tempo para assentar.
                </p>
                <p className={getTransitionClass('delay-700')}>
                    só queria dizer que, apesar do silêncio, ainda estou aqui.
                </p>
                <p className={`font-bold mt-8 ${themeColor} ${getTransitionClass('delay-1000')}`}>
                    com amor.
                </p>
            </div>
            
            <div className={`mt-16 flex flex-col items-center justify-center gap-2 transition-all duration-1000 delay-[1200ms] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <button 
                    onClick={handleLike}
                    className="relative group focus:outline-none"
                >
                    <div className={`absolute inset-0 bg-cozy-clay/20 rounded-full blur-xl transition-opacity duration-500 ${isEternized ? 'opacity-100' : 'opacity-0'}`}></div>
                    <Heart 
                        size={32} 
                        className={`transition-all duration-500 relative z-10 ${
                            likes > 0 ? 'text-cozy-clay fill-current' : 'text-cozy-sageLight'
                        } ${isEternized ? 'scale-125 drop-shadow-lg' : 'group-hover:scale-110'}`} 
                    />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LetterRead;