import type { ASAClass, Assessment } from '../lib/types';

interface Props {
  value: ASAClass | '';
  suggested: ASAClass;
  onChange: (v: ASAClass | '') => void;
}

const ASA_DESCRIPTIONS: { class: ASAClass; label: string; examples: string }[] = [
  {
    class: 1,
    label: 'Normal healthy patient',
    examples: 'No organic, physiologic, or psychiatric disturbance.',
  },
  {
    class: 2,
    label: 'Mild systemic disease',
    examples: 'Mild asthma, controlled DM, HTN, BMI 30–40, age > 60.',
  },
  {
    class: 3,
    label: 'Severe systemic disease',
    examples: 'Poorly controlled DM/HTN, COPD, morbid obesity, active hepatitis, alcohol dependence, implanted pacemaker, ESRD on dialysis.',
  },
  {
    class: 4,
    label: 'Severe disease that is a constant threat to life',
    examples: 'Recent MI/stroke, severe CAD, heart failure (EF < 25%), sepsis, renal failure.',
  },
  {
    class: 5,
    label: 'Moribund patient not expected to survive without operation',
    examples: 'Ruptured AAA, massive trauma, intracranial bleed with mass effect.',
  },
  {
    class: 6,
    label: 'Brain-dead patient for organ donation',
    examples: 'Declared brain-dead.',
  },
];

export default function ASASelector({ value, suggested, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-800">ASA Physical Status</h2>
        {suggested && (
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
            Suggested: ASA {suggested}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500">
        Select the ASA classification manually, or accept the auto-suggestion based on entered comorbidities.
      </p>

      <div className="grid gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="asa"
            value=""
            checked={value === ''}
            onChange={() => onChange('')}
            className="accent-indigo-600"
          />
          <span className="text-sm text-gray-600">Auto-suggest (ASA {suggested})</span>
        </label>

        {ASA_DESCRIPTIONS.map((d) => (
          <label
            key={d.class}
            className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
              value === d.class
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="asa"
              value={d.class}
              checked={value === d.class}
              onChange={() => onChange(d.class)}
              className="mt-0.5 accent-indigo-600"
            />
            <div>
              <div className="font-semibold text-gray-800 text-sm">
                ASA {d.class} — {d.label}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{d.examples}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// Re-export helper to get suggested ASA from outside
export type { ASAClass, Assessment };
