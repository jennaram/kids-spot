import { getAllPlaces } from "@/services/placeServices";
import { Place } from "@/Types/place";
import { handleApiError } from "@/utils/handleApiError";
import { useEffect, useState } from "react";

/**
 * Hook pour gérer l'état et la logique de la lecture de tous les lieux
 * @version 1.1
 * @date 2025-05-15 (Modifié pour inclure refreshTrigger)
 *
 * @param lat - Latitude du point central pour la recherche des lieux
 * @param lng - Longitude du point central pour la recherche des lieux
 * @param refreshTrigger - Déclencheur pour forcer le rechargement des lieux
 * @returns Un objet contenant les lieux, l'état de chargement et les erreurs éventuelles
 *
 * @example
 * ```jsx
 * const { places, loading, error } = useReadAllPlaces(48.85, 2.35, refreshTrigger);
 *
 * if (loading) {
 * console.log("Chargement des lieux...");
 * return <LoadingSpinner />;
 * }
 *
 * if (error) {
 * console.log("Erreur:", error);
 * return <ErrorMessage message={error} />;
 * }
 *
 * console.log(`${places.length} lieux trouvés`);
 * return (
 * <PlacesList places={places} />
 * );
 * ```
 */
export function useReadAllPlaces(lat: number, lng: number, refreshTrigger: number) {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllPlaces(lat, lng);

                if (
                    response.statusCode === 200 &&
                    response.data &&
                    response.data.data &&
                    Array.isArray(response.data.data)
                ) {
                    setPlaces(response.data.data);
                } else if (response.statusCode === 404) {
                    // Si aucun lieu n'est trouvé, on initialise avec un tableau vide
                    setPlaces([]);
                } else {
                    setError("Erreur lors du chargement des lieux.");
                }
            } catch (err) {
                setError(handleApiError(err));
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [lat, lng, refreshTrigger]); // Ajout de refreshTrigger comme dépendance

    return { places, loading, error };
}