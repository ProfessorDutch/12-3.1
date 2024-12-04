import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FormActionsProps {
  loading: boolean;
  onBack: () => void;
}

export default function FormActions({ loading, onBack }: FormActionsProps) {
  return (
    <div className="flex justify-between pt-6">
      <button
        type="button"
        onClick={onBack}
        className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        Back
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-8 py-3 rounded-full bg-patriot-red text-white font-semibold hover:bg-patriot-crimson transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? 'Processing...' : (
          <>Complete Registration <ArrowRight className="w-5 h-5" /></>
        )}
      </button>
    </div>
  );
}