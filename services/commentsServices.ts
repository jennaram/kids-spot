/**
 * Services API pour la gestion des commentaires
 * Créé le: 30/04/2025
 */

import { apiDelete, apiGet, apiPost, apiPut } from "@/services/apiClient";
import { FetchCommentResponse, FetchAllCommentsResponse, AddComment } from "@/types/comment";
import { ApiResponse, ApiResponseSuccessOnly } from "@/types/api-response";
import { checkToken } from "@/utils/auth";

/**
 * Ajoute un nouveau commentaire pour un lieu
 * @param id_lieu - Identifiant du lieu
 * @param commentaire - Texte du commentaire
 * @param note - Note attribuée (évaluation)
 * @param token - Token d'authentification
 */
export async function addComment(data: AddComment, token: string):
  Promise<ApiResponse<ApiResponseSuccessOnly>> {
  checkToken(token);
  return apiPost<ApiResponseSuccessOnly>('commentaires/ajouter', data, token);
}

/**
 * Supprime un commentaire existant
 * @param id - Identifiant du commentaire
 * @param token - Token d'authentification
 */
export async function deleteComment(id: number, token: string):
  Promise<ApiResponse<null>> {
  checkToken(token);
  return apiDelete<null>('commentaires/supprimer', { id }, token);
}

/**
 * Récupère un commentaire spécifique par son identifiant
 * @param id - Identifiant du commentaire
 */
export async function fetchComment(id: number):
  Promise<ApiResponse<FetchCommentResponse>> {
  return apiGet<FetchCommentResponse>(`commentaires/${id}`);
}

/**
 * Récupère tous les commentaires associés à un lieu
 * @param id_lieu - Identifiant du lieu
 */
export async function fetchAllComments(id_lieu: number):
  Promise<ApiResponse<FetchAllCommentsResponse>> {
  return apiGet<FetchAllCommentsResponse>(`commentaires/lieu/${id_lieu}`);
}

/**
 * Modifie un commentaire existant
 * @param id - Identifiant du commentaire
 * @param commentaire - Nouveau texte du commentaire
 * @param note - Nouvelle note attribuée
 * @param token - Token d'authentification
 */
export async function putComment(id: number, commentaire: string, note: number, token: string):
  Promise<ApiResponse<ApiResponseSuccessOnly>> {
  checkToken(token);
  return apiPut<ApiResponseSuccessOnly>('commentaires/modifier', { id, note, commentaire }, token);
}
