/**
 * Services API pour la gestion des lieux
 * Créé le: 01/05/2025
 */

import { ApiResponse, ApiResponseSuccessOnly } from "@/types/api-response";
import { checkToken } from "@/utils/auth";
import { apiDelete, apiPost } from "./apiClient";
import { AddLocationOrEventPayload } from "@/types/location";

/**
 * Ajoute un nouveau lieu ou événement
 */
export async function addLocationOrEvent(data: AddLocationOrEventPayload, token: string): Promise<ApiResponse<ApiResponseSuccessOnly>> {
    checkToken(token);
    return apiPost<ApiResponseSuccessOnly>('lieux/ajout', data, token);
}

/**
 * Supprime un lieu ou un événement
 */
export async function deleteLocation(id: number, token: string): Promise<ApiResponse<ApiResponseSuccessOnly>> {
    checkToken(token)
    return apiDelete<ApiResponseSuccessOnly>('lieux/supprime', { id }, token)
}