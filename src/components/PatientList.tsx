import { useMemo } from 'react';
import type { Assessment } from '../lib/types';
import { calculateRisk } from '../lib/riskEngine';

interface Props {
  assessments: Assessment[];
  onSelect: (a: Assessment) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const LEVEL_BADGE: Record<string, string> = {
  Low: 'bg-green-100 text-green-700',
  Moderate: 'bg-yellow-100 text-yellow-700',
  High: 'bg-orange-100 text-orange-700',
  'Very High': 'bg-red-100 text-red-700',
};

export default function PatientList({ assessments, onSelect, onDelete, onNew }: Props) {
  const riskResults = useMemo(
    () => Object.fromEntries(assessments.map((a) => [a.id, calculateRisk(a)])),
    [assessments],
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Patient Assessments ({assessments.length})
        </h2>
        <button
          onClick={onNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + New Assessment
        </button>
      </div>

      {assessments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">📋</div>
          <p>No assessments yet. Start a new evaluation.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
          {assessments.map((a) => {
            const result = riskResults[a.id];
            return (
              <li
                key={a.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">
                    {a.demographics.name || 'Unnamed Patient'}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {a.demographics.age ? `Age ${a.demographics.age}` : ''}
                    {a.demographics.age && a.demographics.sex ? ' · ' : ''}
                    {a.demographics.sex ? a.demographics.sex : ''}
                    {' · '}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    LEVEL_BADGE[result.level]
                  }`}
                >
                  {result.level}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onSelect(a)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-2 py-1 rounded hover:bg-indigo-50"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onDelete(a.id)}
                    className="text-red-400 hover:text-red-600 text-sm px-2 py-1 rounded hover:bg-red-50"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
