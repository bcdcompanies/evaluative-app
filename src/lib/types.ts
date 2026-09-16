export type Sex = 'male' | 'female' | 'other';

export type ASAClass = 1 | 2 | 3 | 4 | 5 | 6;

export type MallampatiScore = 1 | 2 | 3 | 4;

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High';

export interface Demographics {
  name: string;
  age: number | '';
  sex: Sex | '';
  weightKg: number | '';
  heightCm: number | '';
}

export interface Comorbidities {
  // Cardiovascular
  hypertension: boolean;
  coronaryArteryDisease: boolean;
  heartFailure: boolean;
  arrhythmia: boolean;
  // Respiratory
  asthma: boolean;
  copd: boolean;
  obstructiveSleepApnea: boolean;
  // Metabolic
  diabetes: boolean;
  obesity: boolean;
  // Renal / Hepatic
  renalDisease: boolean;
  hepaticDisease: boolean;
  // Neurological
  seizureDisorder: boolean;
  strokeHistory: boolean;
  // Medications
  anticoagulants: boolean;
  steroids: boolean;
  // Allergies
  drugAllergy: boolean;
  latexAllergy: boolean;
  // Previous complications
  previousAnesthesiaComplications: boolean;
  complicationDetails: string;
}

export interface AirwayAssessment {
  mallampatiScore: MallampatiScore | '';
  mouthOpeningCm: number | '';
  neckMobilityReduced: boolean;
  difficultIntubationHistory: boolean;
}

export interface LabVitals {
  systolicBP: number | '';
  diastolicBP: number | '';
  heartRate: number | '';
  spo2: number | '';
  hemoglobin: number | '';
  creatinine: number | '';
  glucose: number | '';
}

export interface Assessment {
  id: string;
  createdAt: string;
  demographics: Demographics;
  asaClass: ASAClass | '';
  comorbidities: Comorbidities;
  airway: AirwayAssessment;
  labVitals: LabVitals;
}

export interface RiskFlag {
  label: string;
  severity: 'warning' | 'danger';
}

export interface RiskResult {
  level: RiskLevel;
  score: number;
  flags: RiskFlag[];
  recommendations: string[];
  suggestedASA: ASAClass;
}
