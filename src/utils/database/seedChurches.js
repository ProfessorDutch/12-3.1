import { supabase } from '../../config/supabase.js';

const sampleChurches = [
  {
    name: 'Grace Community Church',
    address: '1234 Faith Street, Atlanta, GA 30301',
    coordinates: { lat: 33.7490, lng: -84.3880 },
    members: 250,
    status: 'unclaimed'
  },
  {
    name: 'Hope Fellowship',
    address: '5678 Blessing Road, Marietta, GA 30060',
    coordinates: { lat: 33.9526, lng: -84.5499 },
    members: 175,
    status: 'unclaimed'
  },
  {
    name: 'New Life Baptist Church',
    address: '910 Gospel Way, Alpharetta, GA 30004',
    coordinates: { lat: 34.0754, lng: -84.2941 },
    members: 300,
    status: 'unclaimed'
  },
  {
    name: 'Cornerstone Chapel',
    address: '1112 Prayer Avenue, Sandy Springs, GA 30328',
    coordinates: { lat: 33.9304, lng: -84.3733 },
    members: 225,
    status: 'unclaimed'
  },
  {
    name: 'Faith Harbor Church',
    address: '1314 Worship Lane, Roswell, GA 30075',
    coordinates: { lat: 34.0232, lng: -84.3616 },
    members: 200,
    status: 'unclaimed'
  }
];

async function seedChurches() {
  try {
    console.log('Starting to seed churches...');

    // First check if we already have churches
    const { data: existingChurches, error: checkError } = await supabase
      .from('churches')
      .select('count');

    if (checkError) {
      console.error('Failed to check existing churches:', checkError);
      throw checkError;
    }

    // Only seed if no churches exist
    if (existingChurches && existingChurches[0]?.count === 0) {
      const { data, error } = await supabase
        .from('churches')
        .insert(sampleChurches)
        .select();

      if (error) {
        console.error('Failed to seed churches:', error);
        throw error;
      }

      console.log('Successfully seeded churches:', data);
      return data;
    } else {
      console.log('Churches already exist, skipping seed');
      return null;
    }
  } catch (err) {
    console.error('Failed to seed churches:', err);
    throw err;
  }
}

seedChurches()
  .then(() => {
    console.log('Database seeding completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database seeding failed:', err);
    process.exit(1);
  });