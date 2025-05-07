// src/services/userService.ts
/**
 * Services API pour la gestion des utilisateurs
 * Créé le : 04/05/2025
 */

import { apiGet, apiPost } from '@/services/apiClient';
import { ApiResponse, ApiResponseSuccessOnly } from '@/types/api-response';
import { checkToken } from '@/utils/auth';
import { RegisterUser, AuthResult, ProfilUser } from '@/types/user';

/**
 * Inscription d'un nouvel utilisateur
 * @param user - Données d'inscription : pseudo, mail, mot_de_passe, téléphone
 */
export async function registerUser(user: RegisterUser): 
  Promise<ApiResponse<ApiResponseSuccessOnly>> {
  return apiPost<ApiResponseSuccessOnly>('users/create.php', user);
}

/**
 * Connexion d'un utilisateur existant
 * @param email - Adresse mail
 * @param password - Mot de passe
 */
export async function loginUser(email: string, password: string): 
  Promise<ApiResponse<AuthResult>> {
  const data = { mail: email, mot_de_passe: password };
  return apiPost<AuthResult>('users/login.php', data);
}

export async function profilUser(token: string): 
  Promise<ApiResponse<ProfilUser>> {
    checkToken(token);
  return apiGet<ProfilUser>('profil/read.php',  token );
}