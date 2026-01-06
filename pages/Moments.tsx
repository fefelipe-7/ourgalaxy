import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Plus, Image as ImageIcon } from 'lucide-react';
import { momentService } from '../services/momentService';
import { Moment } from '../lib/supabaseClient';

// Componente para carregar mídia de forma elegante e performática
const LazyMedia: React.FC<{ url: string; type: 'image' | 'video'; alt: string }> = ({ url, type, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full h-full relative bg-cozy-sand/20 overflow-hidden">
      {/* Placeholder Skeleton */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-cozy-sand/30 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100 animate-pulse'}`}
      >
        <ImageIcon className="text-cozy-sageLight/50" size={24} />
      </div>

      {type === 'video' ? (
        <video 
            src={url} 
            controls
            preload="metadata"
            className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoadedData={() => setIsLoaded(true)}
            onClick={(e) => e.stopPropagation()} // Impede navegação ao clicar nos controles
        />
      ) : (
        <img 
            src={url} 
            alt={alt} 
            loading="lazy" 
            decoding="async"
            className={`w-full h-full object-cover transform transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} 
            onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};

const Moments: React.FC = () => {
  const navigate = useNavigate();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados reais
  useEffect(() => {
    const fetchMoments = async () => {
      try {
        const data = await momentService.getMoments();
        setMoments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMoments();
  }, []);

  return (
    <div className="min-h-screen px-6 pt-12 pb-24">
       <div className="flex justify-between items-end mb-10">
        <div>
            <h1 className="text-3xl font-serif text-cozy-deep font-bold">momentos</h1>
            <p className="text-cozy-sageDark text-sm mt-1">memórias conscientes.</p>
        </div>
        <button 
            onClick={() => navigate('/moment/create')}
            className="w-14 h-14 bg-cozy-deep text-white rounded-full shadow-float flex items-center justify-center hover:bg-cozy-charcoal active:scale-90 transition-all"
        >
            <Plus size={24} />
        </button>
      </div>

      <div className="grid gap-8">
        {loading && (
            <div className="text-center py-10 text-cozy-sageLight animate-pulse">
                carregando memórias...
            </div>
        )}

        {!loading && moments.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-cozy-sageLight/30">
                 <Camera size={32} className="mx-auto text-cozy-sand mb-2" />
                 <p className="text-cozy-sageDark font-serif italic">nenhum momento guardado ainda.</p>
            </div>
        )}

        {moments.map((moment) => (
            <div 
                key={moment.id} 
                onClick={() => navigate(`/moment/${moment.id}`)}
                className="group bg-white p-3 pb-6 rounded-[2.5rem] shadow-soft hover:shadow-lg transition-all duration-500 border border-transparent hover:border-cozy-sageLight/10 cursor-pointer active:scale-[0.98]"
            >
                <div className="overflow-hidden rounded-[2rem] h-64 mb-5 relative">
                    <div className="absolute inset-0 bg-cozy-deep/0 group-hover:bg-cozy-deep/5 transition-colors z-10 pointer-events-none"></div>
                    <LazyMedia url={moment.media_url} type={moment.media_type} alt="Moment" />
                </div>
                <div className="px-4 text-center">
                    <p className="text-cozy-deep font-serif text-xl font-medium leading-relaxed line-clamp-2">
                        {moment.description}
                    </p>
                    <div className="w-8 h-1 bg-cozy-sage/30 mx-auto my-4 rounded-full"></div>
                    <div className="flex justify-center items-center gap-2 text-xs font-bold text-cozy-sageDark tracking-wider uppercase">
                         <span>{new Date(moment.date_memory).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                         {moment.time_memory && (
                             <>
                                <span className="w-1 h-1 rounded-full bg-cozy-sageLight"></span>
                                <span>{moment.time_memory.slice(0,5)}</span>
                             </>
                         )}
                         <span className="w-1 h-1 rounded-full bg-cozy-sageLight"></span>
                         <span className={moment.author_id === 'nana' ? 'text-cozy-clay' : 'text-cozy-sageDark'}>
                            por {moment.author_id}
                         </span>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Moments;