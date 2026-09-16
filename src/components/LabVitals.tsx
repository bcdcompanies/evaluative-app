import type { LabVitals } from '../lib/types';

interface Props {
  data: LabVitals;
  onChange: (d: LabVitals) => void;
}

function Field({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  warn,
}: {
  label: string;
  unit: string;
  value: number | '';
  onChange: (v: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  warn?: string | null;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
        <span className="text-sm text-gray-400 whitespace-nowrap">{unit}</span>
      </div>
      {warn && <p className="text-xs text-red-500 mt-1">{warn}</p>}
    </div>
  );
}

export default function LabVitalsForm({ data, onChange }: Props) {
  function update<K extends keyof LabVitals>(key: K, value: LabVitals[K]) {
    onChange({ ...data, [key]: value });
  }

  const sbpWarn =
    data.systolicBP !== '' && (data.systolicBP as number) > 180
      ? '⚠ Hypertensive urgency'
      : data.systolicBP !== '' && (data.systolicBP as number) < 90
      ? '⚠ Hypotension'
      : null;

  const spo2Warn =
    data.spo2 !== '' && (data.spo2 as number) < 95 ? '⚠ Low SpO₂' : null;

  const hrWarn =
    data.heartRate !== '' && ((data.heartRate as number) > 120 || (data.heartRate as number) < 40)
      ? '⚠ Abnormal heart rate'
      : null;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-800">Vitals & Laboratory Values</h2>

      <div>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Systolic Blood Pressure"
            unit="mmHg"
            value={data.systolicBP}
            onChange={(v) => update('systolicBP', v)}
            min={0}
            max={300}
            placeholder="e.g. 120"
            warn={sbpWarn}
          />
          <Field
            label="Diastolic Blood Pressure"
            unit="mmHg"
            value={data.diastolicBP}
            onChange={(v) => update('diastolicBP', v)}
            min={0}
            max={200}
            placeholder="e.g. 80"
          />
          <Field
            label="Heart Rate"
            unit="bpm"
            value={data.heartRate}
            onChange={(v) => update('heartRate', v)}
            min={0}
            max={300}
            placeholder="e.g. 72"
            warn={hrWarn}
          />
          <Field
            label="SpO₂"
            unit="%"
            value={data.spo2}
            onChange={(v) => update('spo2', v)}
            min={0}
            max={100}
            placeholder="e.g. 98"
            warn={spo2Warn}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          Laboratory (optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field
            label="Hemoglobin"
            unit="g/dL"
            value={data.hemoglobin}
            onChange={(v) => update('hemoglobin', v)}
            min={0}
            max={25}
            step={0.1}
            placeholder="e.g. 13.5"
            warn={
              data.hemoglobin !== '' && (data.hemoglobin as number) < 8
                ? '⚠ Severe anemia'
                : null
            }
          />
          <Field
            label="Creatinine"
            unit="mg/dL"
            value={data.creatinine}
            onChange={(v) => update('creatinine', v)}
            min={0}
            step={0.1}
            placeholder="e.g. 1.0"
            warn={
              data.creatinine !== '' && (data.creatinine as number) > 2
                ? '⚠ Elevated creatinine'
                : null
            }
          />
          <Field
            label="Blood Glucose"
            unit="mg/dL"
            value={data.glucose}
            onChange={(v) => update('glucose', v)}
            min={0}
            placeholder="e.g. 100"
            warn={
              data.glucose !== '' && (data.glucose as number) > 250
                ? '⚠ Hyperglycemia'
                : data.glucose !== '' && (data.glucose as number) < 60
                ? '⚠ Hypoglycemia'
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}
