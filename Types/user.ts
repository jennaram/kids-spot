// src/types/user.ts

/**
 * Données pour l'inscription d'un utilisateur
 */
export interface RegisterUser {
    pseudo: string;
    mail: string;
    mot_de_passe: string;
    telephone: string;
  }
  
  /**
   * Données retournées à la connexion
   */
  export interface AuthResult {
    token: string;
    expiresIn: number;
    user?: {
      id: number;
      username: string;
      email: string;
    };
  }