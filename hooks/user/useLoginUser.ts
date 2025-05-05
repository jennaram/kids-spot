import { useState } from 'react';
import { loginUser } from '@/services/userServices';
import { AuthResult } from '@/types/user';
import { handleApiError } from '@/utils/handleApiError';
import { getApiMessage } from '@/utils/apiResponseHelpers';

/**
 * Hook pour gérer l'authentification d'un utilisateur avec gestion des erreurs globales et par champ
 * @version 1.1
 * @date 2025-05-03
 * 
 * @example
 * ```jsx
 * const { submit, loading, data, error, fieldErrors } = useLoginUser();
 * 
 * async function handleLogin() {
 *   await submit('utilisateur@example.com', 'motDePasse123');
 *   
 *   if (error) {
 *     console.log("Erreur de connexion:", error);
 *   }
 *   
 *   if (fieldErrors) {
 *     console.log("Erreurs par champ:", fieldErrors);
 *     // Par exemple: { email: "Format d'email invalide", password: "Mot de passe trop court" }
 *   }
 *   
 *   if (data) {
 *     console.log("Connexion réussie!", data.token);
 *     // Rediriger ou stocker le token
 *   }
 * }
 * ```
 * @returns Un objet contenant la fonction de soumission et les états associés
 */
export function useLoginUser() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AuthResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);

  /**
   * Soumet les identifiants de connexion à l'API d'authentification
   * 
   * @param email - Adresse email de l'utilisateur
   * @param password - Mot de passe de l'utilisateur
   * @returns Une promesse résolue après la tentative de connexion
   */
  async function submit(email: string, password: string) {
    setLoading(true);
    setError(null);
    setFieldErrors(null);
    setData(null);
    
    try {
      const response = await loginUser(email, password);
      if (response.statusCode === 200 && response.data) {
        setData(response.data);
      } else if (response.statusCode === 401) {
        setError(getApiMessage(response));
      } else if (response.statusCode === 422 && response.data) {
        setError('Veuillez corriger les erreurs dans le formulaire');
      } else {
        setError('Échec de la connexion. Veuillez réessayer.');
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      
      if (err.errors && typeof err.errors === 'object') {
        setFieldErrors(err.errors);
      }
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, data, error, fieldErrors };
}