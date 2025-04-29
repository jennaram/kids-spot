import { apiDelete, apiGet, apiPost, apiPut } from "@/services/apiClient";

/**
 * Vérifie si un token d'authentification est présent
 * @param {string} token - Token d'authentification à vérifier
 * @throws {Error} Lance une erreur si le token est absent
 */
function checkToken(token: string) {
    if (!token) {
        throw new Error("Le token d'authentification est requis");
    }
}

/**
 * Ajoute un nouveau commentaire pour un lieu
 * @param {number} id_lieu - Identifiant du lieu concerné
 * @param {string} commentaire - Texte du commentaire
 * @param {number} note - Note attribuée au lieu (valeur numérique)
 * @param {string} token - Token d'authentification de l'utilisateur
 * @returns {Promise<any>} Promesse contenant la réponse de l'API
 * @throws {Error} Lance une erreur si le token est absent
 */
export async function addComment(id_lieu: number, commentaire: string, note: number, token: string) {
    checkToken(token);
    return apiPost('commentaires/ajouter', { id_lieu, note, commentaire }, token);
}

/**
 * Supprime un commentaire existant
 * @param {number} id - Identifiant du commentaire à supprimer
 * @param {string} token - Token d'authentification de l'utilisateur
 * @returns {Promise<any>} Promesse contenant la réponse de l'API
 * @throws {Error} Lance une erreur si le token est absent
 */
export async function deleteComment(id: number, token: string) {
    checkToken(token);
    return apiDelete('commentaires/supprimer', { id }, token);
}

/**
 * Récupère tous les commentaires associés à un lieu
 * @param {number} id_lieu - Identifiant du lieu dont on souhaite récupérer les commentaires
 * @returns {Promise<any>} Promesse contenant la liste des commentaires
 */
export async function fetchAllComments(id_lieu: number) {
    return apiGet(`commentaires/lieu/${id_lieu}`);
}

/**
 * Récupère un commentaire spécifique par son identifiant
 * @param {number} id - Identifiant du commentaire à récupérer
 * @returns {Promise<any>} Promesse contenant les détails du commentaire
 */
export async function fetchComment(id: number) {
    return apiGet(`commentaires/lire/${id}`);
}

/**
 * Met à jour un commentaire existant
 * @param {number} id - Identifiant du commentaire à modifier
 * @param {string} commentaire - Nouveau texte du commentaire
 * @param {number} note - Nouvelle note attribuée (valeur numérique)
 * @param {string} token - Token d'authentification de l'utilisateur
 * @returns {Promise<any>} Promesse contenant la réponse de l'API
 * @throws {Error} Lance une erreur si le token est absent
 */
export async function putComment(id: number, commentaire: string, note: number, token: string) {
    checkToken(token);
    return apiPut('commentaires/modifier', { id, note, commentaire }, token);
}

