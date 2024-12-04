import React, { useState } from 'react';
import { Church, MapPin, Users } from 'lucide-react';
import ChurchSearch from './directory/ChurchSearch';
import { useChurches } from '../hooks/useChurches';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

export default function ChurchFinder() {
  const [churches, setChurches] = useState<any[]>([]);
  const { loading, error, searchChurches } = useChurches();
  const { geocodeAddress } = useGoogleMaps();

  const handleSearch = async (name: string, location: string, radius: number) => {
    const coordinates = await geocodeAddress(location);
    if (!coordinates) {
      console.error('Could not find location');
      return;
    }

    const results = await searchChurches(name, coordinates, radius);
    if (results) {
      setChurches(results);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <Church className="w-12 h-12 text-patriot-red" />
          <div>
            <h2 className="text-2xl font-bold text-patriot-navy">Find Your Church</h2>
            <p className="text-patriot-blue">Connect with faith communities in your area</p>
          </div>
        </div>

        <ChurchSearch onSearch={handleSearch} />
      </div>

      <div className="p-6">
        {error ? (
          <div className="text-center text-patriot-red py-4">{error.message}</div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-patriot-red border-t-transparent mx-auto"></div>
            <p className="mt-4 text-patriot-blue">Searching for churches...</p>
          </div>
        ) : churches.length > 0 ? (
          <div className="space-y-4">
            {churches.map((church) => (
              <div
                key={church.id}
                className="bg-patriot-cream rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-patriot-navy mb-2">{church.name}</h3>
                <div className="flex items-start gap-2 text-patriot-blue mb-2">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span>{church.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-patriot-blue">
                    <Users className="w-5 h-5" />
                    <span>{church.members} members</span>
                  </div>
                  <button className="px-4 py-2 bg-patriot-red text-white rounded-full hover:bg-patriot-crimson transition-colors">
                    Claim as My Church
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-patriot-blue mx-auto mb-4" />
            <h3 className="text-xl font-bold text-patriot-navy mb-2">Find Your Church</h3>
            <p className="text-patriot-blue max-w-md mx-auto">
              Search for your church to connect with your faith community and see how many others attend.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}