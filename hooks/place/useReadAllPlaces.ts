import { getAllPlaces } from "@/services/placeServices";
import { Place } from "@/types/place";
import { useEffect, useState } from "react";

/**
 * Hook pour gérer l'état et la logique de la lecture de tous les lieux
 * @param lat - number - Latitude
 * @param lgt - number - longitude
 * @returns Objet contenant la fonction de soumission et les états associés
 * 
 * @example
 * ```jsx
 * const { locations, loading, error } = useReadAllLocations(48.85, 2.35);
 * ```
 */
export function useReadAllPlaces(lat: number, lgt: number) {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
          try {
            setLoading(true);
            const response = await getAllPlaces(lat, lgt);
    
            if (
              response.statusCode === 200 &&
              response.data &&
              response.data.data &&
              Array.isArray(response.data.data)
            ) {
              setPlaces(response.data.data);
              setError(null);
            } else if (response.statusCode === 404) {
              setPlaces([]);
              setError(null);
            } else {
              setError("Erreur lors du chargement des lieux.");
            }
          } catch (err) {
            console.error("Erreur API :", err);
            setError("Erreur lors de l'appel API.");
          } finally {
            setLoading(false);
          }
        };
    
        load();
      }, [lat, lgt]);
    
      return { places, loading, error };
}
