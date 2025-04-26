import { apiGet } from '../services/apiClient';

async function fetchPlace(id: number) {
  return apiGet(`lieux/${id}`);
}

export default fetchPlace;