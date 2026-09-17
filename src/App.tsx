import { useState, useEffect, useCallback } from 'react';
import type { Assessment, ASAClass } from './lib/types';
import { calculateRisk, suggestASA } from './lib/riskEngine';
import {
  newAssessment,
  loadAssessments,
  saveAssessment,
  deleteAssessment,
} from './storage';
import PatientForm from './components/PatientForm';
import ASASelector from './components/ASASelector';
import ComorbidityChecklist from './components/ComorbidityChecklist';
import AirwayAssessmentForm from './components/AirwayAssessment';
import LabVitalsForm from './components/LabVitals';
import RiskSummary from './components/RiskSummary';
import PatientList from './components/PatientList';

type Step = 'list' | 'demographics' | 'comorbidities' | 'airway' | 'labs' | 'summary';

const STEPS: { key: Step; label: string }[] = [
  { key: 'demographics', label: 'Demographics' },
  { key: 'comorbidities', label: 'Comorbidities' },
  { key: 'airway', label: 'Airway' },
  { key: 'labs', label: 'Vitals & Labs' },
  { key: 'summary', label: 'Summary' },
];

export default function App() {
  const [step, setStep] = useState<Step>('list');
  const [current, setCurrent] = useState<Assessment>(newAssessment());
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    setAssessments(loadAssessments());
  }, []);

  const handleNew = useCallback(() => {
    setCurrent(newAssessment());
    setStep('demographics');
  }, []);

  const handleSelect = useCallback((a: Assessment) => {
    setCurrent(a);
    setStep('summary');
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteAssessment(id);
    setAssessments(loadAssessments());
  }, []);

  function goNext() {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx < STEPS.length - 1) {
      const next = STEPS[idx + 1].key;
      setStep(next);
      if (next === 'summary') {
        saveAssessment(current);
        setAssessments(loadAssessments());
      }
    }
  }

  function goPrev() {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx > 0) setStep(STEPS[idx - 1].key);
    else setStep('list');
  }

  function update(patch: Partial<Assessment>) {
    setCurrent((prev) => ({ ...prev, ...patch }));
  }

  const result = calculateRisk(current);
  const suggestedASA = suggestASA(current);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  if (step === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="max-w-3xl mx-auto">
          <header className="text-center py-8">
            <div className="text-4xl mb-2">🏥</div>
            <h1 className="text-3xl font-bold text-indigo-900">
              Anesthesia Risk Evaluator
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Pre-operative anesthesia risk assessment tool
            </p>
          </header>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <PatientList
              assessments={assessments}
              onSelect={handleSelect}
              onDelete={handleDelete}
              onNew={handleNew}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 py-4 mb-4">
          <button
            onClick={() => setStep('list')}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ← Back to list
          </button>
          <div className="flex-1" />
          <span className="text-xs text-gray-400">
            {current.demographics.name || 'New Patient'}
          </span>
        </header>

        {/* Step indicator */}
        {step !== 'summary' && (
          <div className="flex items-center mb-6">
            {STEPS.filter((s) => s.key !== 'summary').map((s, i) => {
              const si = STEPS.findIndex((x) => x.key === step);
              const done = i < si - 1;
              const active = s.key === step;
              return (
                <div key={s.key} className="flex items-center flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      active
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : done
                        ? 'bg-indigo-200 border-indigo-200 text-indigo-700'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`ml-1 text-xs hidden sm:block ${
                      active ? 'text-indigo-700 font-semibold' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                  {i < STEPS.filter((x) => x.key !== 'summary').length - 1 && (
                    <div className="flex-1 h-px bg-gray-200 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {step === 'demographics' && (
            <>
              <PatientForm
                data={current.demographics}
                onChange={(d) => update({ demographics: d })}
              />
              <div className="mt-6 pt-6 border-t border-gray-100">
                <ASASelector
                  value={current.asaClass}
                  suggested={suggestedASA}
                  onChange={(v) => update({ asaClass: v as ASAClass | '' })}
                />
              </div>
            </>
          )}

          {step === 'comorbidities' && (
            <ComorbidityChecklist
              data={current.comorbidities}
              onChange={(d) => update({ comorbidities: d })}
            />
          )}

          {step === 'airway' && (
            <AirwayAssessmentForm
              data={current.airway}
              onChange={(d) => update({ airway: d })}
            />
          )}

          {step === 'labs' && (
            <LabVitalsForm
              data={current.labVitals}
              onChange={(d) => update({ labVitals: d })}
            />
          )}

          {step === 'summary' && (
            <RiskSummary
              assessment={current}
              result={result}
              onPrint={() => window.print()}
              onNew={handleNew}
            />
          )}

          {/* Navigation */}
          {step !== 'summary' && (
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={goPrev}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back
              </button>
              <button
                onClick={goNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-semibold"
              >
                {stepIndex === STEPS.length - 2 ? 'Generate Report →' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
