export interface SimulationData {
  decision_inicial: string;
  que_quiero: string;
  por_que: string;
  donde: string;
  como: string;
  cuando: string;
  cuando_detalle: string;
  con_quien: string;
  con_quien_detalle: string;
}

export type Step = 'landing' | 'questionnaire' | 'loading' | 'result';

export interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}