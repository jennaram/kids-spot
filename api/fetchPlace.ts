import { apiGet } from '../services/apiClient2';

async function fetchPlace(id: number) {
  return apiGet(`lieux/${id}`);
}

export default fetchPlace;