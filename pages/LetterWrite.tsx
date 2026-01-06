import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, X, ChevronLeft, Check, Sparkles, AlertCircle, Trash2 } from 'lucide-react';
import { letterService } from '../services/letterService';
import { useNavigation } from '../lib/useNavigation';

const RECIPIENTS = [
  { 
      id: 'nana', 
      name: 'nana', 
      image: 'https://i.imgur.com/SjjQo8L_d.webp?maxwidth=760&fidelity=grand',
      color: 'bg-cozy-clay',
      textColor: 'text-cozy-clay',
      ringColor: 'ring-cozy-clay'
  },
  { 
      id: 'fefe', 
      name: 'fefe', 
      image: 'https://i.imgur.com/zkL4pkx_d.webp?maxwidth=760&fidelity=grand',
      color: 'bg-cozy-sageDark',
      textColor: 'text-cozy-sageDark',
      ringColor: 'ring-cozy-sageDark'
  },
];

const LetterWrite: React.FC = () => {
  const navigate = useNavigate();
  const { goBack, goToHome } = useNavigation();
  const [step, setStep] = useState<'recipient' | 'write'>('recipient');
  const [recipient, setRecipient] = useState<typeof RECIPIENTS[0] | null>(null);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Acionado pelo botão "Enviar" da UI
  const handlePreSend = () => {
    if (!recipient || text.length < 5) return;
    setShowConfirm(true);
  };

  // Acionado pelo Modal de Confirmação de Envio
  const handleConfirmSend = async () => {
    setShowConfirm(false);
    if (!recipient) return;
    setStatus('sending');

    try {
      const authorId = recipient.id === 'nana' ? 'fefe' : 'nana'; 
      await letterService.sendLetter(text, authorId, recipient.id);
      
      setStatus('success');
      
      // Delay para mostrar a animação de sucesso antes de sair
      setTimeout(() => {
          navigate('/home');
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar carta:', error);
      setStatus('idle');
      alert('Não foi possível enviar a carta. Tente novamente.');
    }
  };

  // Tenta fechar a carta (checa se há conteúdo para descartar)
  const handleCloseAttempt = () => {
    if (text.trim().length > 0) {
        setShowDiscardConfirm(true);
    } else {
        goToHome();
    }
  };

  // Confirma o descarte
  const handleDiscard = () => {
      setShowDiscardConfirm(false);
      goToHome();
  };

  if (status === 'success') {
      return (
          <div className="min-h-screen bg-cozy-cream flex flex-col items-center justify-center p-8 animate-fade-in">
              <div className="relative">
                 <div className="absolute inset-0 bg-cozy-sage/20 rounded-full blur-3xl animate-pulse-slow"></div>
                 <div className="bg-white p-6 rounded-full shadow-float relative z-10 mb-6">
                    <Check size={48} className="text-cozy-sage" />
                 </div>
                 <Sparkles className="absolute -top-4 -right-4 text-cozy-clay animate-bounce" size={32} />
                 <Sparkles className="absolute bottom-0 -left-8 text-cozy-sageDark animate-pulse" size={24} />
              </div>
              <h2 className="text-3xl font-serif font-bold text-cozy-deep mb-2">Enviada!</h2>
              <p className="text-cozy-sageDark text-center">suas palavras estão a caminho.</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-cozy-cream flex flex-col px-6 pt-safe-top pb-6 transition-opacity duration-500 relative">
      
      {/* Send Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-fade-in">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-cozy-deep/20 backdrop-blur-sm" onClick={() => setShowConfirm(false)}></div>
           
           {/* Modal */}
           <div className="bg-white w-full max-w-sm p-6 rounded-[2rem] shadow-2xl relative z-10 border border-white/50 animate-slide-up">
              <div className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-cozy-sand/30 rounded-full flex items-center justify-center mb-4 text-cozy-deep">
                    <Send size={24} className="-ml-1 mt-1" />
                 </div>
                 <h3 className="font-serif text-xl font-bold text-cozy-deep mb-2">enviar carta?</h3>
                 <p className="text-cozy-sageDark text-sm mb-6 px-4 leading-relaxed">
                    tem certeza que deseja enviar esta carta? ela não poderá ser editada depois.
                 </p>
                 
                 <div className="flex gap-3 w-full">
                    <button 
                       onClick={() => setShowConfirm(false)}
                       className="flex-1 py-3 rounded-xl font-bold text-cozy-sageDark bg-cozy-cream hover:bg-cozy-sand transition-colors"
                    >
                       cancelar
                    </button>
                    <button 
                       onClick={handleConfirmSend}
                       className="flex-1 py-3 rounded-xl font-bold text-white bg-cozy-deep hover:bg-cozy-charcoal transition-colors shadow-lg"
                    >
                       enviar
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-fade-in">
           <div className="absolute inset-0 bg-cozy-deep/20 backdrop-blur-sm" onClick={() => setShowDiscardConfirm(false)}></div>
           
           <div className="bg-white w-full max-w-sm p-6 rounded-[2rem] shadow-2xl relative z-10 border border-white/50 animate-slide-up">
              <div className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-cozy-clay/10 rounded-full flex items-center justify-center mb-4 text-cozy-clay">
                    <Trash2 size={24} className="-ml-0.5" />
                 </div>
                 <h3 className="font-serif text-xl font-bold text-cozy-deep mb-2">descartar carta?</h3>
                 <p className="text-cozy-sageDark text-sm mb-6 px-4 leading-relaxed">
                    se você sair agora, suas palavras serão perdidas para sempre.
                 </p>
                 
                 <div className="flex gap-3 w-full">
                    <button 
                       onClick={() => setShowDiscardConfirm(false)}
                       className="flex-1 py-3 rounded-xl font-bold text-cozy-sageDark bg-cozy-cream hover:bg-cozy-sand transition-colors"
                    >
                       cancelar
                    </button>
                    <button 
                       onClick={handleDiscard}
                       className="flex-1 py-3 rounded-xl font-bold text-white bg-cozy-clay hover:bg-red-400 transition-colors shadow-lg"
                    >
                       descartar
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4 pt-4">
         <button 
            onClick={() => step === 'write' ? setStep('recipient') : handleCloseAttempt()}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-cozy-deep hover:bg-cozy-sand transition-all"
            disabled={status !== 'idle'}
        >
            {step === 'write' ? <ChevronLeft size={20} /> : <X size={20} />}
        </button>
        <span className="text-xs font-bold text-cozy-sageDark tracking-widest uppercase">
            {step === 'recipient' ? 'nova carta' : 'escrevendo'}
        </span>
        
        {/* Botão de Fechar no modo de escrita para acesso rápido */}
        {step === 'write' ? (
             <button 
                onClick={handleCloseAttempt}
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-cozy-sageLight hover:text-cozy-clay hover:bg-cozy-sand transition-all active:scale-90"
                disabled={status !== 'idle'}
            >
                <X size={20} />
            </button>
        ) : (
            <div className="w-10" />
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {step === 'recipient' ? (
            <div className="flex-1 flex flex-col items-center justify-center animate-fade-in -mt-20">
                <h1 className="text-3xl font-serif text-cozy-deep font-bold mb-2 text-center">para quem?</h1>
                <p className="text-cozy-sageDark text-sm mb-12 text-center">escolha quem vai receber seu carinho.</p>

                <div className="flex gap-10 justify-center w-full">
                    {RECIPIENTS.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => { setRecipient(user); setStep('write'); }}
                            className="group flex flex-col items-center gap-4 transition-all"
                        >
                            {/* Reduzido de w-28 para w-20 (80px) */}
                            <div className={`w-20 h-20 rounded-full p-1 bg-white shadow-soft group-hover:scale-110 transition-transform duration-300 ring-2 ring-transparent group-hover:${user.ringColor}`}>
                                <img 
                                    src={user.image} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <span className={`font-serif text-lg font-bold ${user.textColor} opacity-60 group-hover:opacity-100 transition-opacity`}>
                                {user.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="flex-1 bg-white rounded-[2.5rem] shadow-soft p-8 relative flex flex-col border border-cozy-sageLight/10 animate-slide-up">
                <div className="flex items-center gap-4 mb-6 border-b border-cozy-cream pb-6">
                     {/* Reduzido de w-14 para w-10 (40px) */}
                    <div className="w-10 h-10 rounded-full p-0.5 bg-cozy-cream">
                         <img 
                            src={recipient?.image} 
                            alt={recipient?.name} 
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-cozy-sageLight tracking-wider uppercase mb-0.5">para</span>
                        <span className={`font-serif text-xl font-bold ${recipient?.textColor}`}>{recipient?.name}</span>
                    </div>
                </div>
                
                <textarea
                    autoFocus
                    className="w-full flex-1 bg-transparent text-cozy-deep font-serif text-lg leading-loose outline-none resize-none placeholder-cozy-sageLight/50"
                    placeholder={`o que você quer contar pro ${recipient?.name}?`}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={status !== 'idle'}
                />

                <div className="mt-6 flex justify-between items-center pt-4">
                    <span className="text-[10px] text-cozy-sageLight font-bold tracking-widest uppercase">
                        carta privada
                    </span>
                    <button 
                        onClick={handlePreSend}
                        disabled={text.length < 5 || status !== 'idle'}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                            text.length > 5 
                                ? `${recipient?.color} text-white hover:scale-110 active:scale-95` 
                                : 'bg-cozy-sand text-white cursor-not-allowed opacity-50'
                        }`}
                    >
                        {status === 'sending' ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Send size={24} className={text.length > 5 ? 'ml-1' : ''} />
                        )}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default LetterWrite;