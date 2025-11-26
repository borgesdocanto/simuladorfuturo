import React, { useState, useEffect, useRef } from 'react';
import { VoiceInputProps } from '../types';

// Define SpeechRecognition types that might be missing in the environment
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  className = "", 
  multiline = true 
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-AR'; // Español Rioplatense preferred

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        // Append to existing text with a space if not empty
        const newText = value ? `${value} ${transcript}` : transcript;
        onChange(newText);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [value, onChange]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Tu navegador no soporta reconocimiento de voz. Intentá usar Chrome o Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const baseInputClasses = `w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#AA0000] focus:border-transparent transition-all duration-200 ${className}`;

  return (
    <div className="relative w-full">
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseInputClasses} min-h-[120px] resize-none pr-12`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseInputClasses} pr-12`}
        />
      )}
      
      <button
        onClick={toggleListening}
        type="button"
        className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' 
            : 'bg-[#AA0000]/5 text-[#AA0000] hover:bg-[#AA0000]/10'
        }`}
        title="Responder con voz"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </button>
      
      {isListening && (
        <span className="absolute bottom-14 right-2 text-xs font-medium text-red-500 bg-white px-2 py-1 rounded shadow-sm border border-red-100">
          Escuchando...
        </span>
      )}
    </div>
  );
};

export default VoiceInput;