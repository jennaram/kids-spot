import { API_BASE_URL } from '@/api/apiConfig';

type ApiResponse = {
  statusCode: number;
  data: any; // Tu peux remplacer `any` par une interface plus précise si tu veux
};

const getHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

// --- GET ---
export async function apiGet(endpoint: string, token?: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    const statusCode = response.status;
    const data = await response.json();

    return { statusCode, data };
  } catch (error) {
    console.error('Erreur API GET:', error);
    throw error;
  }
}

// --- POST ---
export async function apiPost(endpoint: string, body: object, token?: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(body),
    });

    const statusCode = response.status;
    const data = await response.json();

    return { statusCode, data };
  } catch (error) {
    console.error('Erreur API POST:', error);
    throw error;
  }
}

// --- DELETE ---
export async function apiDelete(endpoint: string, body: object, token?: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(token),
      body: JSON.stringify(body),
    });

    const statusCode = response.status;

    if (statusCode === 204) {
      return { statusCode, data: null };
    }

    const data = await response.json();

    return { statusCode, data };
  } catch (error) {
    console.error('Erreur API DELETE:', error);
    throw error;
  }
}

// --- PUT ---
export async function apiPut(endpoint: string, body: object, token?: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(body),
    });

    const statusCode = response.status;
    const data = await response.json();

    return { statusCode, data };
  } catch (error) {
    console.error('Erreur API PUT:', error);
    throw error;
  }
}