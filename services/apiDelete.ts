import { API_BASE_URL } from '@/api/apiConfig';

export async function apiDelete(endpoint: string, body: object, token?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    const statusCode = response.status;

    // Cas 204 : pas de contenu à parser
    if (statusCode === 204) {
      return {
        statusCode,
        data: null,
      };
    }

    const data = await response.json();

    return {
      statusCode,
      data, // ex: { status: "success", message: "..." }
    };
  } catch (error) {
    console.error('Erreur API DELETE:', error);
    throw error;
  }
}