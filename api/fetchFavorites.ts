import { apiGet } from '@/services/apiClient';

async function fetchNearbyPlaces(latitude: number, longitude: number, token: string) {
  return apiGet(`favoris/lire/${latitude}/${longitude}`, token);
}

export default fetchNearbyPlaces;