import React from 'react';
import { Star } from 'lucide-react';

interface AmbassadorCommitmentsProps {
  commitments: string[];
  errors: Record<string, string>;
  onToggle: (commitment: string) => void;
}

const REQUIRED_COMMITMENTS = [
  'Spread awareness',
  'Engage with community',
  'Support values',
  'Be active'
];

export default function AmbassadorCommitments({ 
  commitments, 
  errors, 
  onToggle 
}: AmbassadorCommitmentsProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ambassador Commitments
      </label>
      <div className="space-y-3">
        {REQUIRED_COMMITMENTS.map((commitment, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onToggle(commitment)}
            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
              commitments.includes(commitment)
                ? 'border-patriot-red bg-patriot-cream'
                : 'border-gray-200 hover:border-patriot-red hover:bg-patriot-cream/50'
            }`}
          >
            <span className="text-patriot-navy">{commitment}</span>
            {commitments.includes(commitment) && (
              <Star className="w-5 h-5 text-patriot-red" />
            )}
          </button>
        ))}
      </div>
      {errors.commitments && (
        <p className="mt-2 text-sm text-red-600">{errors.commitments}</p>
      )}
    </div>
  );
}