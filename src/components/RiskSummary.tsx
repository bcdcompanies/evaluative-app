import type { Assessment, RiskResult } from '../lib/types';

interface Props {
  assessment: Assessment;
  result: RiskResult;
  onPrint: () => void;
  onNew: () => void;
}

const LEVEL_COLORS: Record<string, string> = {
  Low: 'bg-green-100 text-green-800 border-green-300',
  Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  High: 'bg-orange-100 text-orange-800 border-orange-400',
  'Very High': 'bg-red-100 text-red-800 border-red-400',
};

const ASA_BADGE: Record<number, string> = {
  1: 'bg-green-500',
  2: 'bg-blue-500',
  3: 'bg-yellow-500',
  4: 'bg-orange-500',
  5: 'bg-red-600',
  6: 'bg-gray-700',
};

export default function RiskSummary({ assessment, result, onPrint, onNew }: Props) {
  const { demographics, asaClass } = assessment;
  const effectiveASA = asaClass || result.suggestedASA;
  const bmiNum =
    demographics.weightKg && demographics.heightCm
      ? (
          (demographics.weightKg as number) /
          Math.pow((demographics.heightCm as number) / 100, 2)
        ).toFixed(1)
      : null;

  return (
    <div className="space-y-6 print:text-black print:bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <h2 className="text-2xl font-bold text-gray-900">Risk Assessment Summary</h2>
        <div className="flex gap-2">
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            🖨 Print Report
          </button>
          <button
            onClick={onNew}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + New Assessment
          </button>
        </div>
      </div>

      {/* Patient info */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 print:border print:bg-white">
        <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Patient
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-700">
          <div>
            <span className="text-gray-400">Name: </span>
            <span className="font-medium">{demographics.name || '—'}</span>
          </div>
          <div>
            <span className="text-gray-400">Age: </span>
            <span className="font-medium">{demographics.age || '—'} yrs</span>
          </div>
          <div>
            <span className="text-gray-400">Sex: </span>
            <span className="font-medium capitalize">{demographics.sex || '—'}</span>
          </div>
          <div>
            <span className="text-gray-400">BMI: </span>
            <span className="font-medium">{bmiNum ?? '—'}</span>
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-400">
          Assessed: {new Date(assessment.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Risk level banner */}
      <div
        className={`border-2 rounded-xl p-5 text-center ${LEVEL_COLORS[result.level]}`}
      >
        <div className="text-sm font-medium opacity-70 mb-1">Overall Anesthesia Risk</div>
        <div className="text-4xl font-extrabold tracking-tight">{result.level}</div>
        <div className="text-xs opacity-60 mt-1">Risk score: {result.score}</div>
      </div>

      {/* ASA class */}
      <div className="flex items-center gap-3">
        <span
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold ${
            ASA_BADGE[effectiveASA as number] ?? 'bg-gray-400'
          }`}
        >
          {effectiveASA}
        </span>
        <div>
          <div className="font-semibold text-gray-800">ASA Class {effectiveASA}</div>
          {!asaClass && (
            <div className="text-xs text-gray-400">Auto-suggested based on comorbidities</div>
          )}
        </div>
      </div>

      {/* Flags */}
      {result.flags.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Risk Flags</h3>
          <ul className="space-y-1.5">
            {result.flags.map((f, i) => (
              <li
                key={i}
                className={`flex items-start gap-2 text-sm px-3 py-2 rounded-lg ${
                  f.severity === 'danger'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                }`}
              >
                <span>{f.severity === 'danger' ? '🔴' : '🟡'}</span>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Recommendations</h3>
          <ul className="space-y-1.5 list-none">
            {result.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-indigo-500 mt-0.5">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Previous complications */}
      {assessment.comorbidities.previousAnesthesiaComplications &&
        assessment.comorbidities.complicationDetails && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            <span className="font-semibold">Complication Notes: </span>
            {assessment.comorbidities.complicationDetails}
          </div>
        )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 border-t pt-3 print:mt-4">
        This assessment is a decision-support tool and does not replace clinical judgment. All
        findings should be reviewed by a licensed anesthesiologist or appropriate specialist.
      </p>
    </div>
  );
}
