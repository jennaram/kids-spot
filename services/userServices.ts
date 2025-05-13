// src/services/userService.ts
/**
 * Services API pour la gestion des utilisateurs
 * Créé le : 04/05/2025
 */

import { apiGet, apiPost, apiPut } from '@/services/apiClient';
import { ApiResponse, ApiResponseSuccessOnly } from '@/types/api-response';
import { checkToken } from '@/utils/auth';
import { RegisterUser, AuthResult, ResetPass, ProfilUser, FetchProfileResponse } from '@/types/user';
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

export async function sendMail(mail: string):
  Promise<ApiResponse<ApiResponseSuccessOnly>> {
  return apiPost<ApiResponseSuccessOnly>('users/forgot.php', { mail })
}

export async function resetPass(user: ResetPass):
  Promise<ApiResponse<ApiResponseSuccessOnly>> {
    return apiPost<ApiResponseSuccessOnly>('users/reset.php', user)
}


export async function profilUser(token: string): 
  Promise<ApiResponse<FetchProfileResponse>> {
    checkToken(token);
  return apiGet<FetchProfileResponse>('profil/read.php',  token );
}

export async function updateReceiveMailPreference(token: string, opt_in_email: boolean):
  Promise<ApiResponse<ApiResponseSuccessOnly>> {
    return apiPut<ApiResponseSuccessOnly>('users/update.php', { opt_in_email: opt_in_email }, token);
  
}