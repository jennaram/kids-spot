// src/types/profil.ts

/**
 * Données de profil utilisateur
 */
export interface ProfilData {
    id: number;
    pseudo: string;
    mail: string;
    telephone?: string;
    adresse?: string;
    ville?: string;
    code_postal?: string;
    nombre_avis?: number;
}

/**
 * Payload pour la mise à jour du profil
 */
export interface UpdateProfilPayload {
    pseudo?: string;
    mail?: string;
    telephone?: string;
  
   
  
}

/**
 * Réponse API pour les opérations sur le profil
 */
export interface ProfilResponse {
    success: boolean;
    message?: string;
    data?: ProfilData;
}