import { apiGet } from '@/services/apiClient';

async function fetchNearbyPlaces(latitude: number, longitude: number) {
  return apiGet(`lieux/autour/${latitude}/${longitude}`);
}

export default fetchNearbyPlaces;