import type { Assessment, Demographics, Comorbidities, AirwayAssessment, LabVitals } from './lib/types';

export const defaultDemographics: Demographics = {
  name: '',
  age: '',
  sex: '',
  weightKg: '',
  heightCm: '',
};

export const defaultComorbidities: Comorbidities = {
  hypertension: false,
  coronaryArteryDisease: false,
  heartFailure: false,
  arrhythmia: false,
  asthma: false,
  copd: false,
  obstructiveSleepApnea: false,
  diabetes: false,
  obesity: false,
  renalDisease: false,
  hepaticDisease: false,
  seizureDisorder: false,
  strokeHistory: false,
  anticoagulants: false,
  steroids: false,
  drugAllergy: false,
  latexAllergy: false,
  previousAnesthesiaComplications: false,
  complicationDetails: '',
};

export const defaultAirway: AirwayAssessment = {
  mallampatiScore: '',
  mouthOpeningCm: '',
  neckMobilityReduced: false,
  difficultIntubationHistory: false,
};

export const defaultLabVitals: LabVitals = {
  systolicBP: '',
  diastolicBP: '',
  heartRate: '',
  spo2: '',
  hemoglobin: '',
  creatinine: '',
  glucose: '',
};

export function newAssessment(): Assessment {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    demographics: { ...defaultDemographics },
    asaClass: '',
    comorbidities: { ...defaultComorbidities },
    airway: { ...defaultAirway },
    labVitals: { ...defaultLabVitals },
  };
}

const STORAGE_KEY = 'anesthesia_assessments';

export function loadAssessments(): Assessment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Assessment[]) : [];
  } catch {
    return [];
  }
}

export function saveAssessment(assessment: Assessment): void {
  const list = loadAssessments();
  const idx = list.findIndex((a) => a.id === assessment.id);
  if (idx >= 0) list[idx] = assessment;
  else list.unshift(assessment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function deleteAssessment(id: string): void {
  const list = loadAssessments().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
