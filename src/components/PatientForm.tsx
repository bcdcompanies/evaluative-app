import { getBMI } from '../lib/riskEngine';
import type { Demographics } from '../lib/types';

interface Props {
  data: Demographics;
  onChange: (d: Demographics) => void;
}

export default function PatientForm({ data, onChange }: Props) {
  const bmi = getBMI(data.weightKg, data.heightCm);

  function update<K extends keyof Demographics>(key: K, value: Demographics[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Patient Demographics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Patient name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age (years) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            max={120}
            value={data.age}
            onChange={(e) => update('age', e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 45"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
          <select
            value={data.sex}
            onChange={(e) => update('sex', e.target.value as Demographics['sex'])}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            min={0}
            value={data.weightKg}
            onChange={(e) =>
              update('weightKg', e.target.value === '' ? '' : Number(e.target.value))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 70"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          <input
            type="number"
            min={0}
            value={data.heightCm}
            onChange={(e) =>
              update('heightCm', e.target.value === '' ? '' : Number(e.target.value))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 170"
          />
        </div>

        {bmi !== null && (
          <div className="flex items-end">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 w-full">
              <span className="text-sm text-blue-700 font-medium">BMI: </span>
              <span className="text-lg font-bold text-blue-800">{bmi.toFixed(1)}</span>
              <span className="text-xs text-blue-500 ml-2">
                {bmi < 18.5
                  ? 'Underweight'
                  : bmi < 25
                  ? 'Normal'
                  : bmi < 30
                  ? 'Overweight'
                  : bmi < 40
                  ? 'Obese'
                  : 'Morbidly Obese'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
