import { API_BASE_URL } from '@/api//apiConfig';

export async function apiGet(endpoint: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`404: ${endpoint} introuvable.`);
      } else {
        console.error(`Erreur HTTP ${response.status}: ${endpoint}`);
      }
      return null;
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Erreur réseau:", error);
    return null;
  }
}