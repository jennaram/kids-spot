/**
 * Utilitaires pour les appels d'API
 * Créé le: 30/04/2025
 */

import { API_BASE_URL } from '@/api/apiConfig';

/**
 * Type générique pour les réponses d'API
 */
type ApiResponse<T> = {
  ok: any;
  json(): unknown;
  statusCode: number;
  data: T | null;
};

/**
 * Crée les en-têtes HTTP avec authentification optionnelle
 */
const getHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

/**
 * Effectue une requête GET vers l'API
 * @param endpoint - Point d'accès de l'API
 * @param token - Token d'authentification (optionnel)
 */
export async function apiGet<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
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

/**
 * Effectue une requête POST vers l'API
 * @param endpoint - Point d'accès de l'API
 * @param body - Corps de la requête
 * @param token - Token d'authentification (optionnel)
 */
export async function apiPost<T>(endpoint: string, body: object, token?: string): Promise<ApiResponse<T>> {
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

/**
 * Effectue une requête DELETE vers l'API
 * @param endpoint - Point d'accès de l'API
 * @param body - Corps de la requête
 * @param token - Token d'authentification (optionnel)
 */
export async function apiDelete<T>(endpoint: string, body: object, token?: string): Promise<ApiResponse<T>> {
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

/**
 * Effectue une requête PUT vers l'API
 * @param endpoint - Point d'accès de l'API
 * @param body - Corps de la requête
 * @param token - Token d'authentification (optionnel)
 */
export async function apiPut<T>(endpoint: string, body: object, token?: string): Promise<ApiResponse<T>> {
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