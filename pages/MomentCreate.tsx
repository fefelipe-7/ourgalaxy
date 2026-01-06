import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Video, Calendar, Clock, AlignLeft, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { momentService } from '../services/momentService';
import { useNavigation } from '../lib/useNavigation';

const AUTHORS = [
  { 
      id: 'nana', 
      name: 'nana', 
      image: 'https://i.imgur.com/SjjQo8L_d.webp?maxwidth=760&fidelity=grand',
      color: 'bg-cozy-clay' 
  },
  { 
      id: 'fefe', 
      name: 'fefe', 
      image: 'https://i.imgur.com/zkL4pkx_d.webp?maxwidth=760&fidelity=grand',
      color: 'bg-cozy-sageDark' 
  },
];

const MomentCreate: React.FC = () => {
  const navigate = useNavigate();
  const { goBack, goToMoments } = useNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<'author' | 'details'>('author');
  const [author, setAuthor] = useState<typeof AUTHORS[0] | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    if (!file || !author || !date || !description) return;

    setLoading(true);
    try {
      await momentService.createMoment(file, {
        date,
        time,
        description,
        author_id: author.id
      });
      goToMoments();
    } catch (error) {
      console.error('Erro ao salvar momento:', error);
      alert('Não foi possível salvar o momento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cozy-cream px-6 pt-safe-top pb-8 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pt-4">
        <button 
           onClick={() => step === 'details' ? setStep('author') : navigate(-1)}
           className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-cozy-deep hover:bg-cozy-sand transition-all"
        >
           <ChevronLeft size={20} />
        </button>
        <span className="text-xs font-bold text-cozy-sageDark tracking-widest uppercase">
            novo momento
        </span>
        <div className="w-10" />
      </div>

      {step === 'author' ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in -mt-20">
            <h1 className="text-3xl font-serif text-cozy-deep font-bold mb-2">quem registra?</h1>
            <p className="text-cozy-sageDark text-sm mb-12">guardando memórias.</p>

            <div className="flex gap-10">
                {AUTHORS.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => { setAuthor(p); setStep('details'); }}
                        className="group flex flex-col items-center gap-4"
                    >
                        <div className={`w-24 h-24 rounded-full p-1 bg-white shadow-soft group-hover:scale-105 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-cozy-sage`}>
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <span className="font-serif text-xl font-bold text-cozy-deep opacity-60 group-hover:opacity-100 transition-opacity">
                            {p.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
      ) : (
        <div className="flex-1 animate-slide-up flex flex-col">
            
            {/* Upload Area */}
            <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-64 rounded-[2rem] border-2 border-dashed ${file ? 'border-transparent' : 'border-cozy-sageLight/50'} relative overflow-hidden flex flex-col items-center justify-center bg-white cursor-pointer shadow-sm hover:bg-white/80 transition-all mb-6 group`}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*,video/*"
                    className="hidden" 
                />
                
                {preview ? (
                    file?.type.startsWith('video') ? (
                         <div className="w-full h-full bg-cozy-sand/20 flex flex-col items-center justify-center relative">
                             <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm mb-2 shadow-sm">
                                <Video className="text-cozy-sageDark" size={32} />
                             </div>
                             <span className="text-cozy-sageDark font-serif italic text-sm">vídeo selecionado</span>
                             <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full text-cozy-deep shadow-sm">
                                <Camera size={16} />
                             </div>
                         </div>
                    ) : (
                        <div className="relative w-full h-full">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full text-white backdrop-blur-sm">
                                <Camera size={16} />
                            </div>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="flex gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-cozy-cream flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ImageIcon size={20} className="text-cozy-sageDark" />
                            </div>
                            <div className="w-12 h-12 rounded-full bg-cozy-cream flex items-center justify-center group-hover:scale-110 transition-transform delay-75">
                                <Video size={20} className="text-cozy-sageDark" />
                            </div>
                        </div>
                        <span className="text-cozy-sageDark font-bold text-sm">foto ou vídeo</span>
                    </div>
                )}
            </div>

            {/* Inputs */}
            <div className="bg-white rounded-[2rem] p-6 shadow-soft space-y-5">
                
                <div className="flex items-center gap-4 border-b border-cozy-cream pb-4">
                    <Calendar size={20} className="text-cozy-sageLight" />
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-cozy-sageLight uppercase tracking-wider mb-1">data (obrigatório)</label>
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-transparent text-cozy-deep font-serif font-bold text-lg outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 border-b border-cozy-cream pb-4">
                    <Clock size={20} className="text-cozy-sageLight" />
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-cozy-sageLight uppercase tracking-wider mb-1">hora (opcional)</label>
                        <input 
                            type="time" 
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-transparent text-cozy-deep font-serif text-lg outline-none placeholder-cozy-sageLight/50"
                        />
                    </div>
                </div>

                <div className="flex items-start gap-4 pt-1">
                    <AlignLeft size={20} className="text-cozy-sageLight mt-1" />
                    <div className="flex-1">
                         <label className="block text-[10px] font-bold text-cozy-sageLight uppercase tracking-wider mb-1">o recado do momento</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="como você se sentiu?"
                            rows={3}
                            className="w-full bg-transparent text-cozy-deep font-serif text-lg leading-relaxed outline-none resize-none placeholder-cozy-sageLight/50"
                        />
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="mt-8 mb-20">
                <button
                    onClick={handleSave}
                    disabled={!file || !description || loading}
                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                        !file || !description 
                        ? 'bg-cozy-sand cursor-not-allowed' 
                        : `${author?.color || 'bg-cozy-deep'} active:scale-95`
                    }`}
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>compactando & enviando...</span>
                        </>
                    ) : (
                        <span>guardar memória</span>
                    )}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default MomentCreate;