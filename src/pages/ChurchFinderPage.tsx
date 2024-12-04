import React from 'react';
import { Church } from 'lucide-react';
import ChurchSearch from '../components/church/ChurchSearch';
import ChurchList from '../components/church/ChurchList';
import { useChurchFinder } from '../hooks/useChurchFinder';

export default function ChurchFinderPage() {
  const { churches, loading, error, searchChurches, claimChurch } = useChurchFinder();

  const handleClaimChurch = async (churchId: string) => {
    try {
      console.log('Claiming church from ChurchFinderPage:', churchId);
      // For testing, using a mock user ID since we don't have auth yet
      const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
      await claimChurch(churchId, mockUserId);
    } catch (err) {
      console.error('Failed to claim church:', err);
      // Handle error (show error message to user)
    }
  };

  return (
    <main className="flex-1">
      <section className="py-8 bg-gradient-to-br from-patriot-cream to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Church className="w-12 h-12 text-patriot-red" />
            <div>
              <h1 className="text-4xl font-bold text-patriot-navy">Find Your Church</h1>
              <p className="text-xl text-patriot-blue">Connect with faith communities in your area</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <ChurchSearch onSearch={searchChurches} />
            </div>

            <div className="p-6">
              {error ? (
                <div className="text-center text-patriot-red py-4">{error}</div>
              ) : (
                <ChurchList
                  churches={churches}
                  loading={loading}
                  onClaimChurch={handleClaimChurch}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}