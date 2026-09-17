import type {
  ASAClass,
  Assessment,
  RiskFlag,
  RiskLevel,
  RiskResult,
} from './types';

function bmi(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return weightKg / (h * h);
}

/** Suggest ASA class from comorbidities */
export function suggestASA(assessment: Assessment): ASAClass {
  const { comorbidities, demographics, labVitals } = assessment;
  const c = comorbidities;
  const age = demographics.age as number;

  const bmiVal =
    demographics.weightKg && demographics.heightCm
      ? bmi(demographics.weightKg as number, demographics.heightCm as number)
      : 0;

  // ASA V/VI — life-threatening / brain-dead
  // ASA IV
  if (c.heartFailure && c.coronaryArteryDisease) return 4;
  if (labVitals.spo2 !== '' && (labVitals.spo2 as number) < 90) return 4;
  if (c.renalDisease && c.hepaticDisease) return 4;

  // ASA III
  const asa3Factors = [
    c.coronaryArteryDisease,
    c.heartFailure,
    c.arrhythmia,
    c.copd,
    c.obstructiveSleepApnea,
    c.strokeHistory,
    c.renalDisease,
    c.hepaticDisease,
    c.diabetes && c.hypertension,
    bmiVal >= 40,
    age >= 70,
    c.previousAnesthesiaComplications,
  ].filter(Boolean).length;

  if (asa3Factors >= 2) return 3;

  // ASA II
  const asa2Factors = [
    c.hypertension,
    c.asthma,
    c.diabetes,
    c.obesity || bmiVal >= 30,
    c.seizureDisorder,
    c.arrhythmia,
    c.anticoagulants,
    c.steroids,
    age > 60,
  ].filter(Boolean).length;

  if (asa2Factors >= 1) return 2;

  return 1;
}

export function calculateRisk(assessment: Assessment): RiskResult {
  const { comorbidities: c, airway, labVitals, asaClass, demographics } = assessment;
  const flags: RiskFlag[] = [];
  const recommendations: string[] = [];

  // Compute suggested ASA
  const suggestedASA = suggestASA(assessment);
  const effectiveASA = (asaClass || suggestedASA) as ASAClass;

  // --- Score accumulation ---
  let score = 0;

  // ASA contributes heavily
  score += (effectiveASA - 1) * 20;

  // Airway flags
  const mallampati = airway.mallampatiScore as number;
  if (mallampati >= 3) {
    score += mallampati === 4 ? 25 : 15;
    flags.push({ label: 'Difficult airway suspected (Mallampati ≥ 3)', severity: 'danger' });
    recommendations.push('Plan for difficult airway management; consider awake intubation.');
  }
  if (airway.difficultIntubationHistory) {
    score += 20;
    flags.push({ label: 'History of difficult intubation', severity: 'danger' });
    recommendations.push('Review previous anesthesia records. Have video laryngoscope available.');
  }
  if (airway.neckMobilityReduced) {
    score += 10;
    flags.push({ label: 'Reduced neck mobility', severity: 'warning' });
  }
  const mouthOpening = airway.mouthOpeningCm as number;
  if (mouthOpening && mouthOpening < 3) {
    score += 10;
    flags.push({ label: 'Limited mouth opening (< 3 cm)', severity: 'warning' });
    recommendations.push('Assess for TMJ or cervical spine pathology.');
  }

  // Cardiovascular
  if (c.heartFailure) {
    score += 20;
    flags.push({ label: 'Heart failure — elevated cardiac risk', severity: 'danger' });
    recommendations.push('Obtain cardiology clearance. Review echocardiogram.');
  }
  if (c.coronaryArteryDisease) {
    score += 15;
    flags.push({ label: 'Coronary artery disease', severity: 'danger' });
    recommendations.push('Cardiology consult recommended. Consider perioperative beta-blockade.');
  }
  if (c.arrhythmia) {
    score += 10;
    flags.push({ label: 'Known arrhythmia', severity: 'warning' });
    recommendations.push('Obtain 12-lead ECG. Review antiarrhythmic medications.');
  }
  if (c.hypertension) {
    score += 5;
    flags.push({ label: 'Hypertension', severity: 'warning' });
  }

  // Respiratory
  if (c.copd) {
    score += 15;
    flags.push({ label: 'COPD — increased respiratory risk', severity: 'danger' });
    recommendations.push('Optimize bronchodilator therapy pre-operatively. Post-op monitoring advised.');
  }
  if (c.obstructiveSleepApnea) {
    score += 10;
    flags.push({ label: 'Obstructive sleep apnea', severity: 'warning' });
    recommendations.push('CPAP available post-op. Plan for extended monitoring.');
  }
  if (c.asthma) {
    score += 5;
    flags.push({ label: 'Asthma', severity: 'warning' });
    recommendations.push('Ensure bronchodilators available. Consider regional anesthesia if feasible.');
  }

  // Metabolic
  if (c.diabetes) {
    score += 8;
    flags.push({ label: 'Diabetes mellitus', severity: 'warning' });
    recommendations.push('Check blood glucose pre-op and intra-op. Review insulin protocol.');
  }

  const bmiVal =
    demographics.weightKg && demographics.heightCm
      ? bmi(demographics.weightKg as number, demographics.heightCm as number)
      : 0;
  if (bmiVal >= 40) {
    score += 15;
    flags.push({ label: `Morbid obesity (BMI ${bmiVal.toFixed(1)})`, severity: 'danger' });
    recommendations.push('Use bariatric positioning. Consider awake intubation.');
  } else if (bmiVal >= 30) {
    score += 8;
    flags.push({ label: `Obesity (BMI ${bmiVal.toFixed(1)})`, severity: 'warning' });
  }

  // Renal / Hepatic
  if (c.renalDisease) {
    score += 10;
    flags.push({ label: 'Renal disease', severity: 'warning' });
    recommendations.push('Review renal function. Avoid nephrotoxic agents. Adjust drug dosing.');
  }
  if (c.hepaticDisease) {
    score += 10;
    flags.push({ label: 'Hepatic disease', severity: 'warning' });
    recommendations.push('Check coagulation studies. Adjust drug metabolism expectations.');
  }

  // Neurological
  if (c.strokeHistory) {
    score += 10;
    flags.push({ label: 'History of stroke', severity: 'danger' });
    recommendations.push('Maintain cerebral perfusion pressure. Neurology consult if recent stroke.');
  }
  if (c.seizureDisorder) {
    score += 5;
    flags.push({ label: 'Seizure disorder', severity: 'warning' });
    recommendations.push('Continue antiepileptic medications. Avoid pro-convulsant agents.');
  }

  // Medications
  if (c.anticoagulants) {
    score += 10;
    flags.push({ label: 'On anticoagulant therapy', severity: 'danger' });
    recommendations.push('Anticoagulation bridging/reversal plan required. Consult hematology if complex.');
  }
  if (c.steroids) {
    score += 5;
    flags.push({ label: 'Chronic steroid use', severity: 'warning' });
    recommendations.push('Consider stress-dose steroids peri-operatively.');
  }

  // Allergies
  if (c.drugAllergy) {
    score += 5;
    flags.push({ label: 'Known drug allergy', severity: 'warning' });
    recommendations.push('Document allergy in chart. Verify allergy-safe medication substitutes.');
  }
  if (c.latexAllergy) {
    score += 5;
    flags.push({ label: 'Latex allergy', severity: 'warning' });
    recommendations.push('Ensure latex-free environment throughout perioperative care.');
  }

  // Previous complications
  if (c.previousAnesthesiaComplications) {
    score += 15;
    flags.push({ label: 'Previous anesthesia complications', severity: 'danger' });
    recommendations.push('Review prior anesthesia records in detail. Discuss with patient.');
  }

  // Vitals
  const sbp = labVitals.systolicBP as number;
  const spo2 = labVitals.spo2 as number;
  if (sbp && sbp > 180) {
    score += 10;
    flags.push({ label: `Hypertensive urgency (SBP ${sbp} mmHg)`, severity: 'danger' });
    recommendations.push('Consider delaying elective surgery until blood pressure is controlled.');
  }
  if (spo2 && spo2 < 95) {
    score += 10;
    flags.push({ label: `Low SpO2 (${spo2}%)`, severity: 'danger' });
    recommendations.push('Investigate cause of hypoxemia before proceeding with anesthesia.');
  }

  // Standard recommendations
  recommendations.push('Follow NPO guidelines: solids ≥ 8 h, clear liquids ≥ 2 h before induction.');

  // Determine risk level
  let level: RiskLevel;
  if (score < 20) level = 'Low';
  else if (score < 45) level = 'Moderate';
  else if (score < 75) level = 'High';
  else level = 'Very High';

  // Deduplicate recommendations
  const uniqueRecs = [...new Set(recommendations)];

  return { level, score, flags, recommendations: uniqueRecs, suggestedASA };
}

export function getBMI(weightKg: number | '', heightCm: number | ''): number | null {
  if (!weightKg || !heightCm) return null;
  return bmi(weightKg as number, heightCm as number);
}
