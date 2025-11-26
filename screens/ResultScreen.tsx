import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface ResultScreenProps {
  report: string;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ report, onReset }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    
    // Cleanup on unmount
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(report);
      utterance.lang = 'es-ES'; // Use generic Spanish or es-AR if available
      utterance.rate = 1;
      utterance.pitch = 1;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 pb-32">
      <div className="mb-10 text-center animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          Así podría verse tu vida en 12 meses
        </h1>
        <p className="text-lg text-slate-600">
          Según lo que elegís hacer (o no hacer) con tu vivienda.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 prose prose-slate max-w-none animate-fade-in-up delay-100">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-[#AA0000] mt-6 mb-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3" {...props} />,
            p: ({node, ...props}) => <p className="text-slate-700 leading-relaxed mb-4 text-lg" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4 text-slate-700" {...props} />,
            li: ({node, ...props}) => <li className="pl-1" {...props} />,
            strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
          }}
        >
          {report}
        </ReactMarkdown>
      </div>

      <div className="mt-8 flex flex-col gap-4 animate-fade-in-up delay-200">
        <button
          onClick={toggleSpeech}
          className={`w-full flex items-center justify-center p-4 rounded-xl font-semibold transition-all ${
            isPlaying 
              ? 'bg-red-50 text-red-600 border border-red-100' 
              : 'bg-[#AA0000]/5 text-[#AA0000] border border-[#AA0000]/20 hover:bg-[#AA0000]/10'
          }`}
        >
           {isPlaying ? (
             <>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
               Detener audio
             </>
           ) : (
             <>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
               Escuchar mi futuro
             </>
           )}
        </button>

        <div className="mt-8 bg-slate-900 text-white rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-3">¿Querés bajar esto a tierra?</h3>
          <p className="text-slate-300 mb-6">
            Si querés hablar con una persona real, entender tus opciones concretas y transformar este escenario en un plan:
          </p>
          <a 
            href="https://wa.me/5491144581600" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors"
          >
            Quiero hablar con alguien en serio
          </a>
        </div>

        <button 
          onClick={onReset}
          className="mt-8 text-slate-400 text-sm hover:text-slate-600 underline"
        >
          Volver a empezar
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;