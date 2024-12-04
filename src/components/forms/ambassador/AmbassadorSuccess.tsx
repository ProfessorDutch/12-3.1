import React from 'react';
import { Star } from 'lucide-react';

interface AmbassadorSuccessProps {
  onClose: () => void;
}

export default function AmbassadorSuccess({ onClose }: AmbassadorSuccessProps) {
  return (
    <div className="text-center">
      <Star className="w-12 h-12 text-patriot-red mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-patriot-navy mb-4">
        Welcome to The Mustard Seed Movement!
      </h3>
      <p className="text-patriot-blue mb-6">
        Thank you for becoming an Ambassador. Together, we'll make a difference in young lives through faith, purpose, and opportunity.
      </p>
      <button
        onClick={onClose}
        className="bg-patriot-red text-white px-8 py-3 rounded-full hover:bg-patriot-crimson transition-colors"
      >
        Get Started
      </button>
    </div>
  );
}