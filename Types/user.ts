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
   * Données pour la récupération de compte
   */
  export interface ResetPass{
    mail: string;
    mot_de_passe: string;
    token_reinitialisation: string;
  }
  
  /**
   * Données retournées à la connexion
   */
  export interface AuthResult {
    token: string;
    expiresIn: number;
    grade:number;
    pseudo:string;
    user?: {
      id: number;
      username: string;
      email: string;
    };
  }
  export interface ProfilUser {
    id: number;
    pseudo: string;
    mail: string;
    telephone: string;
    recevoirMail:boolean;
  }

  /**
   * Réponse pour la récupération d'un commentaire spécifique
   */
  export interface FetchProfileResponse {
    status: "success";
    data: ProfilUser;
  }