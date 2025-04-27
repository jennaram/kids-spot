// src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost } from '@/services/apiPost';

// Constantes pour les clés de stockage
const TOKEN_STORAGE_KEY = 'token';
const TOKEN_EXPIRATION_KEY = 'tokenExpirationDate';

// Interface pour les résultats d'authentification
interface AuthResult {
  token: string;
  expiresIn: number;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

/**
 * Service centralisé pour la gestion de l'authentification
 */
export const authService = {
  /**
   * Authentifie un utilisateur avec email et mot de passe
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const data = {
        mail: email,
        mot_de_passe: password,
      };
      
      const response = await apiPost('users/login.php', data);
      
      if (!response || !response.token || !response.expiresIn) {
        throw new Error('Réponse API invalide: token ou expiresIn manquant');
      }
      
      // Stocke le token et calcule la date d'expiration
      await this.saveToken(response.token, response.expiresIn);
      
      return response;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },
  
  /**
   * Sauvegarde le token et calcule sa date d'expiration
   */
  async saveToken(token: string, expiresIn: number): Promise<void> {
    try {
      // Convertir expiresIn (secondes) en millisecondes pour le calcul de la date
      const expirationDuration = expiresIn * 1000;
      const expirationDate = new Date(new Date().getTime() + expirationDuration).toISOString();
      
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      await AsyncStorage.setItem(TOKEN_EXPIRATION_KEY, expirationDate);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error);
      throw error;
    }
  },
  
  /**
   * Vérifie si le token actuel est valide
   */
  async getValidToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      const expirationDate = await AsyncStorage.getItem(TOKEN_EXPIRATION_KEY);
      
      if (!token || !expirationDate) {
        return null;
      }
      
      const expirationTime = new Date(expirationDate).getTime();
      const currentTime = new Date().getTime();
      
      // Vérifier si le token est encore valide
      if (currentTime < expirationTime) {
        return token;
      } else {
        // Si expiré, supprimer le token
        await this.logout();
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  },
  
  /**
   * Déconnecte l'utilisateur en supprimant le token
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      await AsyncStorage.removeItem(TOKEN_EXPIRATION_KEY);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }
};