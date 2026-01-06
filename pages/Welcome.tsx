import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1000);
    const timer2 = setTimeout(() => setStep(2), 2500);
    const timer3 = setTimeout(() => setStep(3), 4000);
    const timer4 = setTimeout(() => setStep(4), 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="h-screen w-full flex flex-col relative bg-cozy-cream overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-cozy-sage/20 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
      <div className="absolute bottom-[-20px] left-[-20px] w-48 h-48 bg-cozy-clay/20 rounded-full blur-3xl opacity-60"></div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 z-10 text-center">
        {/* Animated Text Sequence */}
        <div className="space-y-6 font-serif text-cozy-deep">
          <h1 className={`text-4xl transition-all duration-1000 transform ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Lento.
          </h1>
          <h1 className={`text-4xl transition-all duration-1000 transform ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Assíncrono.
          </h1>
          <h1 className={`text-4xl transition-all duration-1000 transform ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Escolhido.
          </h1>
        </div>

        {/* Illustration appearing late */}
         <div className={`mt-12 transition-opacity duration-1000 delay-500 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
             <div className="relative w-48 h-48 mx-auto">
                <div className="absolute inset-0 bg-cozy-sand rounded-full opacity-30 animate-pulse"></div>
                <img 
                    src="https://picsum.photos/seed/calm/400/400" 
                    alt="Calm" 
                    className="relative w-full h-full object-cover rounded-full shadow-soft border-4 border-white"
                />
             </div>
         </div>
      </div>

      <div className={`p-8 pb-12 w-full transition-all duration-1000 transform ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <button 
          onClick={() => navigate('/home')}
          className="group w-full bg-cozy-deep text-white text-lg font-bold py-5 rounded-[2rem] shadow-float hover:bg-cozy-charcoal active:scale-95 transition-all duration-300 flex items-center justify-between px-8"
        >
          <span>Entrar no silêncio</span>
          <div className="bg-white/10 p-2 rounded-full group-hover:translate-x-1 transition-transform">
             <ArrowRight size={20} className="text-cozy-cream" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Welcome;