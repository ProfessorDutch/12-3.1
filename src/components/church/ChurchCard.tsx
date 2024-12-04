import React, { useState } from 'react';
import { MapPin, Users, Heart } from 'lucide-react';
import { Church } from '../../types/church';
import ChurchClaimSuccess from './ChurchClaimSuccess';

interface ChurchCardProps {
  church: Church;
  onClaim: (churchId: string) => void;
}

export default function ChurchCard({ church, onClaim }: ChurchCardProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    try {
      setClaiming(true);
      setError(null);
      await onClaim(church.id);
      setShowSuccess(true);
    } catch (err) {
      console.error('Failed to claim church:', err);
      setError(err instanceof Error ? err.message : 'Failed to claim church');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
        <h3 className="text-xl font-bold text-patriot-navy mb-3">{church.name}</h3>
        <div className="flex items-start gap-2 text-patriot-blue mb-3">
          <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
          <div>
            <p>{church.address}</p>
            {church.distance && (
              <p className="text-sm text-patriot-gray">
                {church.distance.toFixed(1)} miles away
              </p>
            )}
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 mb-3">{error}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-patriot-blue">
            <Users className="w-5 h-5" />
            <span>{church.members} members</span>
          </div>
          <button
            onClick={handleClaim}
            disabled={claiming}
            className={`px-4 py-2 bg-patriot-red text-white rounded-full hover:bg-patriot-crimson transition-colors flex items-center gap-2 ${
              claiming ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Heart className="w-4 h-4" />
            {claiming ? 'Claiming...' : 'Claim as My Church'}
          </button>
        </div>
      </div>

      {showSuccess && (
        <ChurchClaimSuccess 
          churchName={church.name}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}