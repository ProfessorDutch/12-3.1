import React, { useEffect } from 'react';
import { useBlessings } from '../hooks/useBlessings';
import BlessingRequest from './BlessingRequest';
import PaymentModal from './PaymentModal';

export default function BlessingList() {
  const { 
    blessings, 
    loading, 
    error, 
    fetchBlessings 
  } = useBlessings();

  useEffect(() => {
    fetchBlessings();
  }, [fetchBlessings]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-patriot-red border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-patriot-red">{error.message}</p>
        <button 
          onClick={() => fetchBlessings()}
          className="mt-4 text-patriot-blue hover:text-patriot-red transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!blessings?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-patriot-blue">No blessings found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {blessings.map((blessing) => (
        <BlessingRequest
          key={blessing.id}
          {...blessing}
          onSupport={() => {/* Handle support */}}
          onShare={() => {/* Handle share */}}
        />
      ))}
    </div>
  );
}