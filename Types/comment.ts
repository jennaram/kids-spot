
/**
 * Définition des interfaces pour le système de commentaires
 * Créé le: 30/04/2025
 */

/**
 * Représente les informations sommaires d'un utilisateur
 */
export interface UserSummary {
  id: number;
  pseudo: string;
}

/**
 * Représente les informations sommaires d'un lieu
 */
export interface LieuSummary {
  id: number;
  nom: string;
}

/**
 * Dates associées à un commentaire
 */
export interface CommentDate {
  ajout: string;
  modification: string;
}

/**
 * Représente un commentaire complet avec ses relations
 */
export interface Comment {
  id: number;
  commentaire: string;
  note: number;
  date: CommentDate;
  user: UserSummary;
  lieu: LieuSummary;
}

/**
 * Réponse d'API pour les opérations réussies sans données
 */
export interface ApiResponseSuccessOnly {
  status: "success";
  message: string;
}

/**
 * Réponse d'API en cas d'erreur
 */
export interface ApiResponseError {
  status: "error";
  message: string;
}

/**
 * Réponse générique enveloppant n'importe quel type de données
 */
export interface ApiResponse<T> {
  statusCode: number;
  data: T | null;
}

/**
 * Réponse pour la récupération d'un commentaire spécifique
 */
export interface FetchCommentResponse {
  status: "success";
  data: Comment;
}

/**
 * Réponse pour la récupération de tous les commentaires d'un lieu
 */
export interface FetchAllCommentsResponse {
  status: "success";
  data: {
    moyenne_notes: string;
    commentaires: Comment[];
  };
}