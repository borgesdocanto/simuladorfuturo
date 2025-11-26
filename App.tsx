import React, { useState } from 'react';
import LandingScreen from './screens/LandingScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import ResultScreen from './screens/ResultScreen';
import { SimulationData, Step } from './types';
import { generateRealEstateScenario } from './services/gemini';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [initialDecision, setInitialDecision] = useState<string>('');
  const [report, setReport] = useState<string>('');
  const [loadingText, setLoadingText] = useState('Analizando posibilidades...');

  const handleLandingSelect = (decision: string) => {
    setInitialDecision(decision);
    setCurrentStep('questionnaire');
    window.scrollTo(0, 0);
  };

  const handleQuestionnaireComplete = async (data: SimulationData) => {
    setCurrentStep('loading');
    
    // Simulate thinking process for better UX
    const texts = [
      "Analizando tu situación actual...",
      "Proyectando escenarios financieros...",
      "Evaluando impacto emocional...",
      "Generando tu reporte de futuro..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i % texts.length]);
      i++;
    }, 2500);

    try {
      const generatedReport = await generateRealEstateScenario(data);
      setReport(generatedReport);
      setCurrentStep('result');
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
      // Fallback in case of critical error
      setReport("Hubo un error al generar tu reporte. Por favor intentá nuevamente.");
      setCurrentStep('result');
    } finally {
      clearInterval(interval);
    }
  };

  const handleReset = () => {
    setInitialDecision('');
    setReport('');
    setCurrentStep('landing');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#AA0000]/20 selection:text-[#AA0000]">
      <main className="w-full">
        {currentStep === 'landing' && (
          <LandingScreen onSelect={handleLandingSelect} />
        )}
        
        {currentStep === 'questionnaire' && (
          <QuestionnaireScreen 
            initialDecision={initialDecision} 
            onComplete={handleQuestionnaireComplete} 
            onBack={() => setCurrentStep('landing')}
          />
        )}

        {currentStep === 'loading' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-pulse">
            <div className="w-16 h-16 border-4 border-[#AA0000]/20 border-t-[#AA0000] rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{loadingText}</h2>
            <p className="text-slate-500">Esto puede tomar unos segundos.</p>
          </div>
        )}

        {currentStep === 'result' && (
          <ResultScreen report={report} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}

export default App;