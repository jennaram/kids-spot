/**
 * Services API pour la gestion des lieux
 * @date 2025-05-01
 */

import { ApiResponse, ApiResponseSuccessOnly } from "@/types/api-response";
import { checkToken } from "@/utils/auth";
import { apiDelete, apiGet, apiPost, apiPut } from "./apiClient";
import { AddLocationOrEventPayload, FetchAllLocation, FetchLocation, UpdateLocationOrEventPayload } from "@/types/location";

/**
 * Soumet les données du lieu ou de l'événement a ajouter à l'API.
 *
 * @param data - L'objet contenant les informations du lieu ou de l'événement à ajouter.
 * Les propriétés attendues sont :
 * - `nom`: `string` - Le nom du lieu ou de l'événement.
 * - `description`: `string` - Une description du lieu ou de l'événement.
 * - `horaires`: `string` - Les horaires d'ouverture ou l'heure de l'événement.
 * - `adresse`: `string` - L'adresse du lieu.
 * - `ville`: `string` - La ville du lieu.
 * - `code_postal`: `string` - Le code postal du lieu.
 * - `longitude`: `number` - La longitude du lieu.
 * - `latitude`: `number` - La latitude du lieu.
 * - `telephone`: `string` - Le numéro de téléphone du lieu.
 * - `site_web`: `string` - L'URL du site web du lieu.
 * - `id_type`: `number` - L'identifiant du type de lieu ou d'événement.
 * - `equipements`: `number[]` - Un tableau d'identifiants des équipements disponibles.
 * - `tranches_age`: `number[]` - Un tableau d'identifiants des tranches d'âge concernées.
 * - `date_debut`: `string` - (optionnel) - La date de début de l'événement
 * - `date_fin`: `string` - (optionnel) - La date de fin de l'événement
 * @param token - Le token d'authentification.
 * @returns {Promise<ApiResponse<ApiResponseSuccessOnly>>} Une promesse qui résoudra avec la réponse de l'API.
 */
export async function addLocationOrEvent(data: AddLocationOrEventPayload, token: string): Promise<ApiResponse<ApiResponseSuccessOnly>> {
    checkToken(token);
    return apiPost<ApiResponseSuccessOnly>('lieux/ajout', data, token);
}

/**
 * Supprime un lieu ou un événement
 * @param id `number` - L'identifiant du lieu ou de l'événement à supprimer.
 * @param token `string` - Le token d'authentification.
 * @returns {Promise<ApiResponse<ApiResponseSuccessOnly>>} Une promesse qui résoudra avec la réponse de l'API.
 */
export async function deleteLocation(id: number, token: string): Promise<ApiResponse<ApiResponseSuccessOnly>> {
    checkToken(token);
    return apiDelete<ApiResponseSuccessOnly>('lieux/supprime', { id }, token);
}

/**
 * Soumet les données du lieu ou de l'événement a éditer à l'API.
 *
 * @param data - L'objet contenant les informations du lieu ou de l'événement à ajouter.
 * Les propriétés attendues sont :
 * - `id`: `number` - L'identifiant du lieu ou de l'événement à modifier
 * - `nom`: `string` - Le nom du lieu ou de l'événement.
 * - `description`: `string` - Une description du lieu ou de l'événement.
 * - `horaires`: `string` - Les horaires d'ouverture ou l'heure de l'événement.
 * - `adresse`: `string` - L'adresse du lieu.
 * - `ville`: `string` - La ville du lieu.
 * - `code_postal`: `string` - Le code postal du lieu.
 * - `longitude`: `number` - La longitude du lieu.
 * - `latitude`: `number` - La latitude du lieu.
 * - `telephone`: `string` - Le numéro de téléphone du lieu.
 * - `site_web`: `string` - L'URL du site web du lieu.
 * - `id_type`: `number` - L'identifiant du type de lieu ou d'événement.
 * - `equipements`: `number[]` - Un tableau d'identifiants des équipements disponibles.
 * - `tranches_age`: `number[]` - Un tableau d'identifiants des tranches d'âge concernées.
 * - `date_debut`: `string` - (optionnel) - La date de début de l'événement
 * - `date_fin`: `string` - (optionnel) - La date de fin de l'événement
 * @param token - Le token d'authentification.
 * @returns {Promise<ApiResponse<ApiResponseSuccessOnly>>} Une promesse qui résoudra avec la réponse de l'API.
 */
export async function editLocationOrEvent(data: UpdateLocationOrEventPayload, token: string): Promise<ApiResponse<ApiResponseSuccessOnly>> {
    checkToken(token);
    return apiPut<ApiResponseSuccessOnly>('lieux/modifier', data, token);
}

/**
 * Récupération des lieu autour d'une position depuis l'API
 * 
 * @param lat `number`- La latitude
 * @param lgt `number - La longitude
 * @returns {Promise<ApiResponse<FetchAllLocation>>} Une promesse qui résoudra avec la réponse de l'API.
 */
export async function getAllLocation(lat: number, lgt: number): Promise<ApiResponse<FetchAllLocation>> {
    return apiGet<FetchAllLocation>(`lieux/autour/${lat}/${lgt}`);
}

/**
 * Récupération d'un lieu à partir de son identifiant depuis l'API
 * 
 * @param id `number`- Identifiant du lieu
 * @returns {Promise<ApiResponse<FetchLocation>>} Une promesse qui résoudra avec la réponse de l'API.
 */
export async function getLocation(id: number): Promise<ApiResponse<FetchLocation>> {
    return apiGet<FetchLocation>(`lieux/${id}`);
}
