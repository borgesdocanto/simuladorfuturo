import React, { useState } from 'react';

interface LandingScreenProps {
  onSelect: (decision: string) => void;
}

type Role = 'COMPRADOR' | 'VENDEDOR' | null;

const LandingScreen: React.FC<LandingScreenProps> = ({ onSelect }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>(null);

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleUrgencySelect = (urgency: string) => {
    if (!role) return;
    // Construct a clear decision string for the AI and next steps
    const finalDecision = `PERFIL: ${role}. MOMENTO: ${urgency}`;
    onSelect(finalDecision);
  };

  const handleBack = () => {
    setStep(1);
    setRole(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center text-center min-h-[80vh] justify-center">
      <div className="mb-10 animate-fade-in-up">
        <span className="inline-block p-4 rounded-full bg-[#AA0000]/5 text-[#AA0000] mb-6">
          {/* Futuristic Abstract Logo */}
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
            <line x1="12" y1="22" x2="12" y2="7"/>
          </svg>
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Simulador del Futuro Inmobiliario
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {step === 1 
            ? "Para empezar, contame en qué vereda estás hoy:" 
            : `Ok, estás pensando en ${role === 'COMPRADOR' ? 'comprar' : 'vender'}. ¿Qué tan decidido estás?`}
        </p>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl animate-fade-in-up delay-100">
          <button 
            onClick={() => handleRoleSelect('COMPRADOR')}
            className="group flex flex-col items-center justify-center p-10 rounded-2xl bg-white border-2 border-slate-100 hover:border-[#AA0000] hover:shadow-xl hover:shadow-[#AA0000]/10 transition-all duration-300 text-center h-full"
          >
            <div className="w-16 h-16 bg-[#AA0000]/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#AA0000] group-hover:text-white transition-colors duration-300 text-[#AA0000]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/><path d="M12 7v5"/><path d="M12 15h.01"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Pensando en COMPRAR</h3>
            <p className="text-slate-500">Quiero dejar de alquilar, mudarme a algo más grande o invertir.</p>
          </button>

          <button 
            onClick={() => handleRoleSelect('VENDEDOR')}
            className="group flex flex-col items-center justify-center p-10 rounded-2xl bg-white border-2 border-slate-100 hover:border-[#AA0000] hover:shadow-xl hover:shadow-[#AA0000]/10 transition-all duration-300 text-center h-full"
          >
            <div className="w-16 h-16 bg-[#AA0000]/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#AA0000] group-hover:text-white transition-colors duration-300 text-[#AA0000]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12V6c0-1.66-1.34-3-3-3H4.8c-1 0-1.8.8-1.8 1.8V17a2 2 0 0 0 2 2h3.2"/><path d="M14 17h6.8c1 0 1.8-.8 1.8-1.8V9.8c0-1-1.34-1.8-3-1.8H15"/><path d="M22 13h-4"/><path d="M12 17v-5"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Pensando en VENDER</h3>
            <p className="text-slate-500">Quiero vender mi propiedad actual, achicarme o necesito el capital.</p>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-xl animate-fade-in-up">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => handleUrgencySelect("Quiero verdaderamente decidir YA")}
              className="group p-6 rounded-xl bg-white border border-slate-200 hover:border-[#AA0000] hover:bg-[#AA0000]/5 transition-all text-left flex items-center"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Quiero verdaderamente decidir YA</h3>
                <p className="text-sm text-slate-500">Necesito resolver esto en el corto plazo.</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-[#AA0000] transition-colors"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <button 
              onClick={() => handleUrgencySelect("Pienso hacerlo más adelante")}
              className="group p-6 rounded-xl bg-white border border-slate-200 hover:border-[#AA0000] hover:bg-[#AA0000]/5 transition-all text-left flex items-center"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Pienso hacerlo más adelante</h3>
                <p className="text-sm text-slate-500">Quizás en 6 meses o un año, pero quiero proyectar.</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-[#AA0000] transition-colors"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <button 
              onClick={() => handleUrgencySelect("Tengo más ganas de esperar")}
              className="group p-6 rounded-xl bg-white border border-slate-200 hover:border-[#AA0000] hover:bg-[#AA0000]/5 transition-all text-left flex items-center"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Tengo más ganas de esperar / Dudas</h3>
                <p className="text-sm text-slate-500">Prefiero no moverme todavía, pero quiero ver qué pasa si espero.</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-[#AA0000] transition-colors"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <button 
            onClick={handleBack}
            className="mt-8 text-slate-400 hover:text-slate-600 text-sm font-medium flex items-center justify-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Volver a elegir perfil
          </button>
        </div>
      )}
    </div>
  );
};

export default LandingScreen;