import { apiGet } from "@/services/apiClient";
import { apiDelete } from "@/services/apiDelete";
import { apiPost } from "@/services/apiPost";


function checkToken(token: string) {
    if (!token) {
        throw new Error("Le token d'authentification est requis");
    }
}

export async function addFavorite(id_lieu: number, token: string) {
    checkToken(token);

    try {
        const response = await apiPost('favoris/ajouter', { id_lieu }, token);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function deleteFavorite(id_lieu: number, token: string) {
    checkToken(token);
    return apiDelete('favoris/supprimer', { id_lieu }, token);
}

export async function fetchNearbyFavorites(latitude: number, longitude: number, token: string) {
    checkToken(token);

    try {
        const response = await apiGet(`favoris/lire/${latitude}/${longitude}`, token);
        return response;
    } catch (error) {
        throw error;
    }
}