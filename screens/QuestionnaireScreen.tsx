import React, { useState, useEffect } from 'react';
import { SimulationData } from '../types';
import VoiceInput from '../components/VoiceInput';

interface QuestionnaireProps {
  initialDecision: string;
  onComplete: (data: SimulationData) => void;
  onBack: () => void;
}

const steps = [
  { id: 'que', title: '¿Qué?' },
  { id: 'por_que', title: '¿Por qué?' },
  { id: 'donde', title: '¿Dónde?' },
  { id: 'como', title: '¿Cómo?' },
  { id: 'cuando', title: '¿Cuándo?' },
  { id: 'con_quien', title: '¿Con quién?' },
];

const QuestionnaireScreen: React.FC<QuestionnaireProps> = ({ initialDecision, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SimulationData>({
    decision_inicial: initialDecision,
    que_quiero: '',
    por_que: '',
    donde: '',
    como: '',
    cuando: '',
    cuando_detalle: '',
    con_quien: '',
    con_quien_detalle: '',
  });

  const [role, setRole] = useState<'COMPRADOR' | 'VENDEDOR' | 'GENERAL'>('GENERAL');

  useEffect(() => {
    if (initialDecision.includes('COMPRADOR')) setRole('COMPRADOR');
    else if (initialDecision.includes('VENDEDOR')) setRole('VENDEDOR');
    else setRole('GENERAL');
  }, [initialDecision]);

  const handleChange = (field: keyof SimulationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      onComplete(formData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      onBack();
    }
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0: return formData.que_quiero.length > 2;
      case 1: return formData.por_que.length > 2;
      case 2: return formData.donde.length > 2;
      case 3: return formData.como.length > 2;
      case 4: return formData.cuando.length > 0;
      case 5: return formData.con_quien.length > 0;
      default: return false;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 pb-32">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-[#AA0000] uppercase tracking-wider">
            Paso {currentStep + 1} de {steps.length}
          </span>
          <span className="text-xs font-medium text-slate-400">
             {steps[currentStep].title}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#AA0000] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="animate-fade-in-up">
        {/* Step 1: QUE */}
        {currentStep === 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Qué querés lograr con tu situación inmobiliaria?</h2>
            <div className="space-y-4">
              <VoiceInput 
                value={formData.que_quiero}
                onChange={(val) => handleChange('que_quiero', val)}
                placeholder={role === 'VENDEDOR' 
                  ? "Ej: Vender mi casa actual para achicarme, Vender para irme del país..." 
                  : "Ej: Comprar mi primera casa, Dejar de alquilar, Invertir ahorros..."
                }
              />
              <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                {role === 'VENDEDOR' ? (
                   <>
                    <span className="px-3 py-1 bg-slate-100 rounded-full">Vender para comprar otra</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full">Achicarme</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full">Liquidez</span>
                   </>
                ) : (
                   <>
                    <span className="px-3 py-1 bg-slate-100 rounded-full">Comprar primera vivienda</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full">Dejar de alquilar</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full">Agrandarme</span>
                   </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: POR QUE */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Por qué querés hacer este cambio?</h2>
            <p className="text-slate-600 mb-6 text-sm">
              Acá no me interesa lo técnico. Contame lo emocional:
              <br/>
              {role === 'VENDEDOR' ? (
                <>• <strong>Vendedor:</strong> ¿La casa te queda grande? ¿Necesitás la plata? ¿Querés cerrar una etapa?</>
              ) : (
                <>• <strong>Comprador:</strong> ¿Sueño propio? ¿Harto de mudarte? ¿Seguridad para tus hijos?</>
              )}
            </p>
            <VoiceInput 
              value={formData.por_que}
              onChange={(val) => handleChange('por_que', val)}
              placeholder="Contame qué te impulsa, qué te duele hoy..."
            />
          </div>
        )}

        {/* Step 3: DONDE */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {role === 'VENDEDOR' ? "¿A dónde planeás ir después de vender?" : "¿Dónde te imaginás viviendo?"}
            </h2>
            <p className="text-slate-600 mb-6 text-sm">
              Puede ser un barrio específico, una ciudad, o simplemente el tipo de lugar: más verde, más céntrico, más silencioso.
            </p>
            <VoiceInput 
              value={formData.donde}
              onChange={(val) => handleChange('donde', val)}
              placeholder="Describí el lugar ideal..."
            />
          </div>
        )}

        {/* Step 4: COMO */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Cómo pensás financiar este movimiento?</h2>
            <p className="text-slate-600 mb-6 text-sm">
              {role === 'VENDEDOR' ? (
                "¿Con la venta alcanza para lo que querés hacer? ¿Necesitás poner algo encima? ¿Te sobra?"
              ) : (
                "¿Tenés ahorros? ¿Necesitás vender algo antes? ¿Crédito hipotecario? ¿Ayuda familiar?"
              )}
            </p>
            <VoiceInput 
              value={formData.como}
              onChange={(val) => handleChange('como', val)}
              placeholder="Explicá brevemente tu plan..."
            />
          </div>
        )}

        {/* Step 5: CUANDO */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">¿Cuándo imaginás tomar acción en serio?</h2>
            <div className="space-y-3 mb-6">
              {[
                "Ya mismo",
                "En los próximos 3 meses",
                "En los próximos 6 meses",
                "Dentro de un año o más",
                "Cuando se den ciertas condiciones"
              ].map((opt) => (
                <label key={opt} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.cuando === opt ? 'border-[#AA0000] bg-[#AA0000]/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="cuando" 
                    value={opt} 
                    checked={formData.cuando === opt} 
                    onChange={(e) => handleChange('cuando', e.target.value)}
                    className="w-4 h-4 text-[#AA0000] focus:ring-[#AA0000]"
                  />
                  <span className="ml-3 text-slate-800 font-medium">{opt}</span>
                </label>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-700 mb-2">Algo más para agregar (Opcional)</p>
            <VoiceInput 
              value={formData.cuando_detalle}
              onChange={(val) => handleChange('cuando_detalle', val)}
              placeholder="Contame algo más si querés..."
              multiline={false}
              className="!min-h-0"
            />
          </div>
        )}

        {/* Step 6: CON QUIEN */}
        {currentStep === 5 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">¿Quién te acompaña en esta decisión?</h2>
            <div className="space-y-3 mb-6">
              {[
                "Estoy decidiendo solo/a",
                "Con mi pareja",
                "Con mi familia",
                "Mis hijas/os",
                "Nadie sabe que estoy pensando en esto"
              ].map((opt) => (
                <label key={opt} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.con_quien === opt ? 'border-[#AA0000] bg-[#AA0000]/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="con_quien" 
                    value={opt} 
                    checked={formData.con_quien === opt} 
                    onChange={(e) => handleChange('con_quien', e.target.value)}
                    className="w-4 h-4 text-[#AA0000] focus:ring-[#AA0000]"
                  />
                  <span className="ml-3 text-slate-800 font-medium">{opt}</span>
                </label>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-700 mb-2">Si hay tensiones, miedos o diferencias, contámelo (Opcional)</p>
            <VoiceInput 
              value={formData.con_quien_detalle}
              onChange={(val) => handleChange('con_quien_detalle', val)}
              placeholder="Detalles sobre las personas involucradas..."
            />
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-6 flex justify-between items-center max-w-4xl mx-auto z-10 safe-area-bottom">
        <button 
          onClick={handlePrev}
          className="px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
        >
          {currentStep === 0 ? "Volver" : "Atrás"}
        </button>
        <button 
          onClick={handleNext}
          disabled={!isCurrentStepValid()}
          className={`px-8 py-3 rounded-xl font-semibold shadow-lg shadow-[#AA0000]/20 transition-all transform ${
            isCurrentStepValid() 
              ? 'bg-[#AA0000] text-white hover:bg-[#880000] hover:shadow-xl hover:-translate-y-0.5' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {currentStep === steps.length - 1 ? "Ver mi futuro" : "Siguiente"}
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireScreen;