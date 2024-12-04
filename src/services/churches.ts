import { supabase } from '../config/supabase';
import { Church } from '../types/church';

export async function searchChurches(query: string, location: { lat: number; lng: number }, radius: number) {
  try {
    console.log('Searching churches:', { query, location, radius });
    
    const { data, error } = await supabase
      .from('churches')
      .select('*')
      .eq('status', 'unclaimed');

    if (error) {
      console.error('Failed to search churches:', error);
      throw error;
    }

    console.log('Found churches:', data);

    // Filter churches within radius if coordinates exist
    const filteredChurches = data?.filter(church => {
      if (!church.coordinates) return true; // Include churches without coordinates
      const distance = calculateDistance(
        location.lat,
        location.lng,
        church.coordinates.lat,
        church.coordinates.lng
      );
      return distance <= radius;
    }).map(church => ({
      id: church.id,
      name: church.name,
      address: church.address,
      members: church.members || 0,
      coordinates: church.coordinates,
      distance: church.coordinates ? calculateDistance(
        location.lat,
        location.lng,
        church.coordinates.lat,
        church.coordinates.lng
      ) : undefined
    })) || [];

    return filteredChurches;
  } catch (err) {
    console.error('Church search failed:', err);
    throw err;
  }
}

export async function claimChurch(churchId: string, userId: string) {
  try {
    console.log('Claiming church:', { churchId, userId });

    // Start a transaction
    const { data: church, error: updateError } = await supabase
      .from('churches')
      .update({
        claimed_by: userId,
        claimed_at: new Date().toISOString(),
        status: 'claimed'
      })
      .eq('id', churchId)
      .eq('status', 'unclaimed')
      .is('claimed_by', null)
      .select()
      .single();

    if (updateError) {
      console.error('Failed to claim church:', updateError);
      throw updateError;
    }

    if (!church) {
      throw new Error('Church has already been claimed');
    }

    // Create church membership
    const { error: membershipError } = await supabase
      .from('church_members')
      .insert({
        church_id: churchId,
        user_id: userId,
        role: 'member',
        status: 'active',
        joined_at: new Date().toISOString(),
        ministry_interests: []
      });

    if (membershipError) {
      console.error('Failed to create membership:', membershipError);
      // Rollback church claim
      await supabase
        .from('churches')
        .update({
          claimed_by: null,
          claimed_at: null,
          status: 'unclaimed'
        })
        .eq('id', churchId);
      throw membershipError;
    }

    console.log('Church claimed successfully:', church);
    return church;
  } catch (err) {
    console.error('Church claim failed:', err);
    throw err;
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}