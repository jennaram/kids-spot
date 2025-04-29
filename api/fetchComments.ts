import { apiGet } from '../services/apiClient2';

async function fetchPlace(id: number) {
  return apiGet(`commentaires/lieu/${id}`);
}

export default fetchPlace;