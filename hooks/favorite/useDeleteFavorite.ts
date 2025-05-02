import { deleteFavorite } from "@/services/favoritesServices";
import { useState } from "react";

/**
 * Hook pour gérer l'état et la logique de la suppression d'un favori
 * @returns Objet contenant la fonction de soumission et les états associés
 * 
 * @example
 * ```jsx
 * const { removeFavorite, loading, success, error } = useDeleteFavorite();
 * removeFavorite(19, token);
 * ```
 */
export function useDeleteFavorite() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const removeFavorite = async (id: number, token: string) => {
        setLoading(true);
        setSuccess(false);
        setError(null);

        try {
            const response = await deleteFavorite(id, token);
            if (response.statusCode === 204) {
                setSuccess(true);
            } else {
                setError("Erreur lors de la suppression du favori.");
            }
        } catch (err) {
            console.error("Erreur API :", err);
            setError("Erreur lors de l'appel à l'API.");
        } finally {
            setLoading(false);
        }
    };

    return { removeFavorite, loading, success, error };
}