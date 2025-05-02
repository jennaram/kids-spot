import { fetchNearbyFavorites } from "@/services/favoritesServices";
import { Location } from "@/types/location";
import { useEffect, useState } from "react";

/**
 * Hook pour gérer l'état et la logique de la lecture de tous les favoris
 * @param lat - number - Latitude
 * @param lgt - number - longitude
 * @param token - string - Jeton d'authentification
 * @param trigger - number - Clé pour forcer le rafraîchissement
 * 
 * @example
 * ```jsx
 * const { favoris, loading, error } = useReadAllFavorites(48.85, 2.35, token, refreshKey);
 * ```
 */
export function useReadAllFavorites(lat: number, lgt: number, token: string, trigger: number) {
    const [favoris, setFavoris] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const response = await fetchNearbyFavorites(lat, lgt, token);

                if (
                    response.statusCode === 200 &&
                    response.data &&
                    response.data.data &&
                    Array.isArray(response.data.data)
                ) {
                    setFavoris(response.data.data);
                    setError(null);
                } else if (response.statusCode === 404) {
                    setFavoris([]);
                    setError(null);
                } else {
                    setError("Erreur lors du chargement des favoris.");
                }
            } catch (err) {
                console.error("Erreur API :", err);
                setError("Erreur lors de l'appel API.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [lat, lgt, token, trigger]); // 👈 ajout du trigger ici

    return { favoris, loading, error };
}