
/**
 * Définition des interfaces pour le système de commentaires
 * Créé le: 30/04/2025
 */

/**
 * Représente les informations a envoyer
 */
export interface AddComment{
  id_lieu: number,
  commentaire: string,
  note: number,
  token: string
}

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