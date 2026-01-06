import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation, Heart, MapPin } from 'lucide-react';

const MapDetails: React.FC = () => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="min-h-screen bg-cozy-cream px-6 pt-10 pb-8 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <button
           onClick={() => navigate(-1)}
           className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-cozy-deep hover:bg-cozy-sand transition-all active:scale-90"
        >
           <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-bold text-cozy-sageDark tracking-wider">localização</span>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col">
          <div className="w-full h-80 bg-white rounded-[2.5rem] shadow-soft overflow-hidden relative mb-8 group">
             <img
                src="https://picsum.photos/seed/map/600/800"
                alt="Map Location"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-cozy-deep/50 to-transparent pointer-events-none" />
             <div className="absolute bottom-6 left-6 text-white">
                 <div className="flex items-center gap-2 mb-1">
                    <MapPin size={16} />
                    <span className="text-xs font-bold tracking-wider">12km de distância</span>
                 </div>
             </div>
          </div>

          <h1 className="text-3xl font-serif text-cozy-deep font-bold mb-4 leading-tight">
              o parque onde<br/>nos conhecemos
          </h1>
          <p className="text-cozy-deep/80 font-serif text-lg leading-relaxed mb-8">
              aquele banco perto do lago ainda está lá. a luz da tarde bate exatamente do mesmo jeito.
          </p>

          <div className="mt-auto flex gap-4">
              <button
                 className="flex-1 bg-cozy-deep text-white h-16 rounded-[2rem] font-bold text-lg shadow-float flex items-center justify-center gap-3 transition-transform active:scale-95 hover:bg-cozy-charcoal duration-200"
              >
                 <Navigation size={20} />
                 <span>navegar</span>
              </button>

              <button
                 onClick={() => setIsLiked(!isLiked)}
                 className={`w-16 h-16 rounded-[2rem] shadow-soft flex items-center justify-center transition-all duration-300 active:scale-75 ${isLiked ? 'bg-cozy-clay/20 text-cozy-clay' : 'bg-white text-cozy-deep hover:bg-cozy-sand'}`}
              >
                 <Heart size={24} className={`transition-transform duration-300 ${isLiked ? 'fill-current scale-110' : 'scale-100'}`} />
              </button>
          </div>
      </div>
    </div>
  );
};

export default MapDetails;