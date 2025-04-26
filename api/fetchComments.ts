import { apiGet } from '../services/apiClient';

async function fetchPlace(id: number) {
  return apiGet(`commentaires/lieu/${id}`);
}

export default fetchPlace;