import { getPlace } from "@/services/placeServices";
import { Place } from "@/Types/place";
import { handleApiError } from "@/utils/handleApiError";
import { useEffect, useState } from "react";

/**
 * Hook pour gérer l'état et la logique de la lecture d'un lieu spécifique
 * @version 1.0
 * @date 2025-05-01
 * 
 * @param id - Identifiant numérique du lieu à récupérer
 * @returns Un objet contenant le lieu, l'état de chargement et les erreurs éventuelles
 * 
 * @example
 * ```jsx
 * const { place, loading, error } = useReadPlace(1);
 * 
 * if (loading) {
 *    console.log("Chargement du lieu...");
 *    return <LoadingSpinner />;
 * }
 * 
 * if (error) {
 *    console.log("Erreur:", error);
 *    return <ErrorMessage message={error} />;
 * }
 * 
 * if (!place) {
 *    return <NotFoundMessage message="Lieu non trouvé" />;
 * }
 * 
 * return (
 *    <PlaceDetails place={place} />
 * );
 * ```
 */
export function useReadPlace(id: number) {
    const [place, setPlace] = useState<Place | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getPlace(id);
                
                if (
                    response.statusCode === 200 &&
                    response.data
                ) {
                    setPlace(response.data.data);
                } else if (response.statusCode === 404) {
                    setPlace(null);
                } else {
                    setError("Erreur lors du chargement du lieu.");
                }
            } catch (err) {
                setError(handleApiError(err));
            } finally {
                setLoading(false);
            }
        };
    
        load();
    }, [id]);
    
    return { place, loading, error };
}
