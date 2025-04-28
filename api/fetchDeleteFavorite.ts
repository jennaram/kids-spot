import { apiDelete } from '@/services/apiDelete';

async function deleteFavorite(id_lieu: number, token: string) {
    if (!token) {
        throw new Error('Le token d\'authentification est requis');
    }

    const data = {
        id_lieu: id_lieu
    };

    try {
        // Utilisation de la fonction apiPost existante
        const response = await apiDelete('favoris/supprimer', data, token);

        return response;
    } catch (error) {
        console.error("Erreur lors du Delete:", error);
        throw error;
    }
}

export default deleteFavorite;