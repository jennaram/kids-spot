/**
 * Services API pour la gestion des lieux
 * Créé le: 01/05/2025
 */

import { ApiResponse, ApiResponseSuccessOnly } from "@/types/api-response";
import { checkToken } from "@/utils/auth";
import { apiPost } from "./apiClient";
import { AddLocationOrEventPayload } from "@/types/location";

/**
 * Ajoute un nouveau lieu ou évenement
 */
export async function addLocationOrEvent(data: AddLocationOrEventPayload, token: string): Promise<ApiResponse<ApiResponseSuccessOnly>> {
    checkToken(token);
    return apiPost<ApiResponseSuccessOnly>('lieux/ajout', data, token);
}