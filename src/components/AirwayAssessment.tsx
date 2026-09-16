import type { AirwayAssessment, MallampatiScore } from '../lib/types';

interface Props {
  data: AirwayAssessment;
  onChange: (d: AirwayAssessment) => void;
}

const MALLAMPATI_DESCRIPTIONS: { score: MallampatiScore; label: string; desc: string }[] = [
  { score: 1, label: 'Class I', desc: 'Soft palate, uvula, fauces, pillars visible' },
  { score: 2, label: 'Class II', desc: 'Soft palate, uvula, fauces visible' },
  { score: 3, label: 'Class III', desc: 'Soft palate, base of uvula visible' },
  { score: 4, label: 'Class IV', desc: 'Soft palate not visible' },
];

export default function AirwayAssessmentForm({ data, onChange }: Props) {
  function update<K extends keyof AirwayAssessment>(key: K, value: AirwayAssessment[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-800">Airway Assessment</h2>

      {/* Mallampati */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mallampati Score
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {MALLAMPATI_DESCRIPTIONS.map(({ score, label, desc }) => (
            <button
              key={score}
              type="button"
              onClick={() => update('mallampatiScore', score)}
              className={`border rounded-lg p-3 text-left transition-colors ${
                data.mallampatiScore === score
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-lg mb-1
                ${data.mallampatiScore === score ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'}">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    data.mallampatiScore === score
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {score}
                </span>
              </div>
              <div className="font-semibold text-sm text-gray-800">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
        {data.mallampatiScore && (data.mallampatiScore as number) >= 3 && (
          <p className="mt-2 text-sm text-red-600 font-medium">
            ⚠ Mallampati ≥ 3 indicates potential difficult intubation.
          </p>
        )}
      </div>

      {/* Mouth Opening */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mouth Opening (cm)
        </label>
        <input
          type="number"
          min={0}
          max={10}
          step={0.5}
          value={data.mouthOpeningCm}
          onChange={(e) =>
            update('mouthOpeningCm', e.target.value === '' ? '' : Number(e.target.value))
          }
          className="w-40 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 4"
        />
        <p className="text-xs text-gray-400 mt-1">Normal ≥ 3 cm (two finger-breadths)</p>
        {data.mouthOpeningCm !== '' && (data.mouthOpeningCm as number) < 3 && (
          <p className="text-sm text-red-600 font-medium mt-1">⚠ Limited mouth opening (&lt; 3 cm)</p>
        )}
      </div>

      {/* Checkboxes */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.neckMobilityReduced}
            onChange={(e) => update('neckMobilityReduced', e.target.checked)}
            className="w-4 h-4 accent-indigo-600"
          />
          <span className="text-sm text-gray-700">Reduced neck mobility / cervical restriction</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.difficultIntubationHistory}
            onChange={(e) => update('difficultIntubationHistory', e.target.checked)}
            className="w-4 h-4 accent-indigo-600"
          />
          <span className="text-sm text-gray-700">History of difficult intubation</span>
        </label>
      </div>
    </div>
  );
}
