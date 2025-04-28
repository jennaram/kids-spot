import { apiPost } from '@/services/apiPost';

async function addFavorite(id_lieu: number, token: string) {
    if (!token) {
        throw new Error('Le token d\'authentification est requis');
    }

    const data = {
        id_lieu: id_lieu
    };

    try {
        // Utilisation de la fonction apiPost existante
        const response = await apiPost('favoris/ajouter', data, token);

        return response;
    } catch (error) {
        console.error("Erreur lors de la création du post:", error);
        throw error;
    }
}

export default addFavorite;