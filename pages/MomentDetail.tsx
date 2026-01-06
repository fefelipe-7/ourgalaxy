import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, Loader2 } from 'lucide-react';
import { momentService } from '../services/momentService';
import { Moment } from '../lib/supabaseClient';

const AUTHORS_INFO = {
  nana: {
    name: 'nana',
    image: 'https://i.imgur.com/SjjQo8L_d.webp?maxwidth=760&fidelity=grand',
    color: 'text-cozy-clay'
  },
  fefe: {
    name: 'fefe',
    image: 'https://i.imgur.com/zkL4pkx_d.webp?maxwidth=760&fidelity=grand',
    color: 'text-cozy-sageDark'
  }
};

const MomentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [moment, setMoment] = useState<Moment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoment = async () => {
      if (!id) return;
      try {
        const data = await momentService.getMomentById(id);
        setMoment(data);
      } catch (error) {
        console.error('Erro ao buscar detalhe do momento:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMoment();
  }, [id]);

  if (loading) {
      return (
          <div className="min-h-screen bg-cozy-cream flex items-center justify-center">
              <Loader2 className="animate-spin text-cozy-sage" size={32} />
          </div>
      );
  }

  if (!moment) {
      return (
          <div className="min-h-screen bg-cozy-cream flex flex-col items-center justify-center p-8 text-center">
              <p className="text-cozy-sageDark font-serif mb-4">memória não encontrada.</p>
              <button 
                onClick={() => navigate('/moments')}
                className="text-cozy-deep font-bold underline underline-offset-4"
              >
                  voltar
              </button>
          </div>
      );
  }

  const author = AUTHORS_INFO[moment.author_id as keyof typeof AUTHORS_INFO] || AUTHORS_INFO.nana;

  return (
    <div className="min-h-screen bg-cozy-cream flex flex-col px-6 pt-safe-top pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pt-4">
        <button 
           onClick={() => navigate(-1)}
           className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-cozy-deep hover:bg-cozy-sand transition-all active:scale-90"
        >
           <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cozy-sageDark bg-cozy-sageLight/20 px-3 py-1 rounded-full tracking-wider uppercase">
                memória
            </span>
        </div>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
          
          {/* Media Card */}
          <div className="w-full bg-white p-2 rounded-[2.5rem] shadow-soft">
              <div className="w-full aspect-square sm:aspect-[4/3] rounded-[2rem] overflow-hidden bg-cozy-sand/20 relative">
                  {moment.media_type === 'video' ? (
                      <video 
                          src={moment.media_url} 
                          controls 
                          className="w-full h-full object-contain bg-black"
                      />
                  ) : (
                      <img 
                          src={moment.media_url} 
                          alt={moment.description} 
                          className="w-full h-full object-cover"
                      />
                  )}
              </div>
          </div>

          {/* Details */}
          <div className="px-2">
              <div className="flex items-center justify-between mb-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full p-0.5 border border-cozy-sageLight/50">
                          <img 
                            src={author.image} 
                            alt={author.name} 
                            className="w-full h-full object-cover rounded-full"
                          />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-[10px] text-cozy-sageLight font-bold uppercase tracking-widest leading-none mb-1">registrado por</span>
                          <span className={`font-serif font-bold text-lg leading-none ${author.color}`}>{author.name}</span>
                      </div>
                  </div>

                  {/* Date Info */}
                  <div className="text-right">
                       <div className="flex items-center justify-end gap-1.5 text-cozy-sageDark mb-1">
                            <Calendar size={14} />
                            <span className="text-xs font-bold tracking-wider">
                                {new Date(moment.date_memory).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                       </div>
                       {moment.time_memory && (
                           <div className="flex items-center justify-end gap-1.5 text-cozy-sageLight">
                                <Clock size={14} />
                                <span className="text-xs font-bold tracking-wider">{moment.time_memory.slice(0,5)}</span>
                           </div>
                       )}
                  </div>
              </div>

              {/* Description */}
              <div className="bg-white/60 rounded-[2rem] p-6 border border-white/50 backdrop-blur-sm">
                  <p className="text-cozy-deep font-serif text-xl leading-loose italic text-center">
                      "{moment.description}"
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default MomentDetail;