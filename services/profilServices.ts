// src/services/profil.service.ts
/**
 * Services API pour la gestion des profils utilisateurs
 * Créé le : 06/05/2025
 */

import { apiPost, apiGet } from '@/services/apiClient';
import { ApiResponse } from '@/Types/api-response';
import { checkToken } from '@/utils/auth';

// Types pour le profil 
interface ProfilData {
  id: string;
  pseudo: string;
  mail: string;
  telephone?: string;
  adresse?: string;
 
}

/**
 * Récupère le profil utilisateur 
 * @param userId - ID de l'utilisateur
 */
export async function getProfil(userId: string): Promise<ApiResponse<ProfilData>> {
  const response = await apiGet<ProfilData & { nombreEnfants?: number; ageEnfants?: number[] }>(
    `profil/get.php?id=${userId}`
  );

  // Filtrer les champs indésirables côté client si l'API ne le fait pas
  if (response.success && response.data) {
    const { nombreEnfants, ageEnfants, ...profilFiltre } = response.data;
    return { ...response, data: profilFiltre };
  }

  return response;
}

/**
 * Met à jour le profil utilisateur (exemple supplémentaire)
 * @param userId - ID de l'utilisateur
 * @param updates - Champs modifiables (exclure "nombreEnfants" et "ageEnfants")
 */
export async function updateProfil(
  userId: string,
  updates: Omit<Partial<ProfilData>, 'nombreEnfants' | 'ageEnfants'>
): Promise<ApiResponse<ProfilData>> {
  return apiPost<ProfilData>('profil/update.php', { id: userId, ...updates });
}