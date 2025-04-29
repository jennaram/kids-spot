import { apiDelete, apiGet, apiPost } from "@/services/apiClient";

function checkToken(token: string) {
  if (!token) {
    throw new Error("Le token d'authentification est requis");
  }
}

export async function addFavorite(id_lieu: number, token: string) {
  checkToken(token);
  return apiPost('favoris/ajouter', { id_lieu }, token);
}

export async function deleteFavorite(id_lieu: number, token: string) {
  checkToken(token);
  return apiDelete('favoris/supprimer', { id_lieu }, token);
}

export async function fetchNearbyFavorites(latitude: number, longitude: number, token: string) {
  checkToken(token);
  return apiGet(`favoris/lire/${latitude}/${longitude}`, token);
}