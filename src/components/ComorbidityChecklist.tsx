import type { Comorbidities } from '../lib/types';

interface Props {
  data: Comorbidities;
  onChange: (d: Comorbidities) => void;
}

interface CheckboxGroupProps {
  title: string;
  items: { key: keyof Comorbidities; label: string }[];
  data: Comorbidities;
  onChange: (d: Comorbidities) => void;
}

function CheckboxGroup({ title, items, data, onChange }: CheckboxGroupProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-2">
      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={data[key] as boolean}
              onChange={(e) => onChange({ ...data, [key]: e.target.checked })}
              className="w-4 h-4 accent-indigo-600"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function ComorbidityChecklist({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Comorbidities & Medical History</h2>

      <CheckboxGroup
        title="Cardiovascular"
        data={data}
        onChange={onChange}
        items={[
          { key: 'hypertension', label: 'Hypertension' },
          { key: 'coronaryArteryDisease', label: 'Coronary artery disease (CAD)' },
          { key: 'heartFailure', label: 'Heart failure' },
          { key: 'arrhythmia', label: 'Arrhythmia' },
        ]}
      />

      <CheckboxGroup
        title="Respiratory"
        data={data}
        onChange={onChange}
        items={[
          { key: 'asthma', label: 'Asthma' },
          { key: 'copd', label: 'COPD' },
          { key: 'obstructiveSleepApnea', label: 'Obstructive sleep apnea (OSA)' },
        ]}
      />

      <CheckboxGroup
        title="Metabolic"
        data={data}
        onChange={onChange}
        items={[
          { key: 'diabetes', label: 'Diabetes mellitus' },
          { key: 'obesity', label: 'Obesity (clinician-assessed)' },
        ]}
      />

      <CheckboxGroup
        title="Renal / Hepatic"
        data={data}
        onChange={onChange}
        items={[
          { key: 'renalDisease', label: 'Renal disease / CKD' },
          { key: 'hepaticDisease', label: 'Hepatic disease / cirrhosis' },
        ]}
      />

      <CheckboxGroup
        title="Neurological"
        data={data}
        onChange={onChange}
        items={[
          { key: 'seizureDisorder', label: 'Seizure disorder / epilepsy' },
          { key: 'strokeHistory', label: 'History of stroke / TIA' },
        ]}
      />

      <CheckboxGroup
        title="Current Medications"
        data={data}
        onChange={onChange}
        items={[
          { key: 'anticoagulants', label: 'Anticoagulants (warfarin, NOACs, heparin)' },
          { key: 'steroids', label: 'Chronic steroids / immunosuppressants' },
        ]}
      />

      <CheckboxGroup
        title="Allergies"
        data={data}
        onChange={onChange}
        items={[
          { key: 'drugAllergy', label: 'Known drug allergy' },
          { key: 'latexAllergy', label: 'Latex allergy' },
        ]}
      />

      <div className="border border-gray-200 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          Previous Anesthesia
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.previousAnesthesiaComplications}
            onChange={(e) =>
              onChange({ ...data, previousAnesthesiaComplications: e.target.checked })
            }
            className="w-4 h-4 accent-indigo-600"
          />
          <span className="text-sm text-gray-700">Previous anesthesia complications</span>
        </label>
        {data.previousAnesthesiaComplications && (
          <textarea
            value={data.complicationDetails}
            onChange={(e) => onChange({ ...data, complicationDetails: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Describe previous complications…"
          />
        )}
      </div>
    </div>
  );
}
