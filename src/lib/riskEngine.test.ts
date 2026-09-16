import { describe, it, expect } from 'vitest';
import { calculateRisk, suggestASA, getBMI } from './riskEngine';
import { newAssessment } from '../storage';

function makeAssessment(overrides: object = {}) {
  const base = newAssessment();
  return Object.assign(base, overrides);
}

describe('getBMI', () => {
  it('returns null for missing inputs', () => {
    expect(getBMI('', 170)).toBeNull();
    expect(getBMI(70, '')).toBeNull();
  });
  it('calculates BMI correctly', () => {
    expect(getBMI(70, 170)).toBeCloseTo(24.22, 1);
  });
});

describe('suggestASA', () => {
  it('returns ASA 1 for healthy patient', () => {
    expect(suggestASA(makeAssessment())).toBe(1);
  });

  it('returns ASA 2 for hypertension alone', () => {
    const a = makeAssessment();
    a.comorbidities.hypertension = true;
    expect(suggestASA(a)).toBe(2);
  });

  it('returns ASA 3 for CAD + arrhythmia', () => {
    const a = makeAssessment();
    a.comorbidities.coronaryArteryDisease = true;
    a.comorbidities.arrhythmia = true;
    expect(suggestASA(a)).toBe(3);
  });

  it('returns ASA 4 for heart failure + CAD', () => {
    const a = makeAssessment();
    a.comorbidities.heartFailure = true;
    a.comorbidities.coronaryArteryDisease = true;
    expect(suggestASA(a)).toBe(4);
  });
});

describe('calculateRisk', () => {
  it('returns Low risk for healthy patient', () => {
    expect(calculateRisk(makeAssessment()).level).toBe('Low');
  });

  it('flags difficult airway for Mallampati 4', () => {
    const a = makeAssessment();
    a.airway.mallampatiScore = 4;
    const result = calculateRisk(a);
    expect(result.flags.some(f => f.label.includes('Mallampati'))).toBe(true);
  });

  it('flags anticoagulants', () => {
    const a = makeAssessment();
    a.comorbidities.anticoagulants = true;
    const result = calculateRisk(a);
    expect(result.flags.some(f => f.label.includes('anticoagulant'))).toBe(true);
  });

  it('returns Very High for complex patient', () => {
    const a = makeAssessment();
    a.comorbidities.heartFailure = true;
    a.comorbidities.coronaryArteryDisease = true;
    a.comorbidities.copd = true;
    a.airway.mallampatiScore = 4;
    a.airway.difficultIntubationHistory = true;
    a.comorbidities.anticoagulants = true;
    a.comorbidities.previousAnesthesiaComplications = true;
    const result = calculateRisk(a);
    expect(['High', 'Very High']).toContain(result.level);
  });

  it('includes NPO recommendation always', () => {
    const result = calculateRisk(makeAssessment());
    expect(result.recommendations.some(r => r.includes('NPO'))).toBe(true);
  });
});
