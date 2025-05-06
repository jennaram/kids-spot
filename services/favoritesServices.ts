/**
 * Services API pour la gestion des commentaires
 * Créé le: 30/04/2025
 */

import { apiDelete, apiGet, apiPost } from "@/services/apiClient";
import { ApiResponse, ApiResponseSuccessOnly } from "@/types/api-response";
import { FetchAllPlaces } from "@/types/place";
import { checkToken } from "@/utils/auth";


export async function addFavorite(id_lieu: number, token: string):Promise<ApiResponse<ApiResponseSuccessOnly>> {
  checkToken(token);
  return apiPost<ApiResponseSuccessOnly>('favoris/ajouter', { id_lieu }, token);
}

export async function deleteFavorite(id_lieu: number, token: string):Promise<ApiResponse<null>> {
  checkToken(token);
  return apiDelete<null>('favoris/supprimer', { id_lieu }, token);
}

export async function fetchNearbyFavorites(latitude: number, longitude: number, token: string):Promise<ApiResponse<FetchAllPlaces>> {
  checkToken(token);
  return apiGet<FetchAllPlaces>(`favoris/lire/${latitude}/${longitude}`, token);
}