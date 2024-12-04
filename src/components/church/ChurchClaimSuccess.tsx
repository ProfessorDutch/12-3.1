import React from 'react';
import { Church, Heart, Star, Share2, X } from 'lucide-react';

interface ChurchClaimSuccessProps {
  churchName: string;
  onClose: () => void;
}

export default function ChurchClaimSuccess({ churchName, onClose }: ChurchClaimSuccessProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-auto p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <Church className="w-16 h-16 text-patriot-red mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-patriot-navy mb-4">
            Welcome to {churchName}!
          </h2>
          <p className="text-patriot-blue mb-8">
            Your church has been claimed successfully. Now let's start planting seeds of faith together!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-patriot-cream rounded-xl p-6">
              <Heart className="w-8 h-8 text-patriot-red mx-auto mb-3" />
              <h3 className="font-semibold text-patriot-navy mb-2">Share Love</h3>
              <p className="text-sm text-patriot-gray">
                Invite fellow church members to join our community
              </p>
            </div>

            <div className="bg-patriot-cream rounded-xl p-6">
              <Star className="w-8 h-8 text-patriot-red mx-auto mb-3" />
              <h3 className="font-semibold text-patriot-navy mb-2">Plant Seeds</h3>
              <p className="text-sm text-patriot-gray">
                Support youth ministry initiatives at your church
              </p>
            </div>

            <div className="bg-patriot-cream rounded-xl p-6">
              <Share2 className="w-8 h-8 text-patriot-red mx-auto mb-3" />
              <h3 className="font-semibold text-patriot-navy mb-2">Spread Word</h3>
              <p className="text-sm text-patriot-gray">
                Share your church's impact stories
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="bg-patriot-red text-white px-8 py-3 rounded-full hover:bg-patriot-crimson transition-colors"
          >
            Start My Journey
          </button>
        </div>
      </div>
    </div>
  );
}