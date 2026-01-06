import React from 'react';
import { Mail, Heart, Image } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    // Adicionado pb-safe-bottom e ajustado bottom-8 para garantir que não fique em cima da home bar
    <div className="absolute bottom-8 left-0 right-0 px-8 z-50 mb-safe-bottom pointer-events-none">
      <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] h-20 shadow-float flex items-center justify-around px-2 border border-white/50 pointer-events-auto">
        <button 
          onClick={() => navigate('/home')}
          className={`group flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${isActive('/home') ? 'bg-cozy-deep text-white shadow-lg -translate-y-4' : 'hover:bg-cozy-cream text-cozy-sageDark'}`}
          aria-label="cartas"
        >
          <Mail size={24} strokeWidth={isActive('/home') ? 2.5 : 2} />
        </button>
        
        <button 
          onClick={() => navigate('/absences')}
          className={`group flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${isActive('/absences') ? 'bg-cozy-deep text-white shadow-lg -translate-y-4' : 'hover:bg-cozy-cream text-cozy-sageDark'}`}
          aria-label="saudades"
        >
          <Heart size={24} strokeWidth={isActive('/absences') ? 2.5 : 2} />
        </button>

        <button 
           onClick={() => navigate('/moments')}
           className={`group flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${isActive('/moments') ? 'bg-cozy-deep text-white shadow-lg -translate-y-4' : 'hover:bg-cozy-cream text-cozy-sageDark'}`}
           aria-label="momentos"
        >
          <Image size={24} strokeWidth={isActive('/moments') ? 2.5 : 2} />
        </button>
      </div>
    </div>
  );
};

export default BottomNav;