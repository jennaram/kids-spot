import { getLocation } from "@/services/locationsServices";
import { Location } from "@/types/location";
import { useEffect, useState } from "react";

/**
 * Hook pour gérer l'état et la logique de la lecture de tous les lieux
 * @param id - number - Identifiant
 * @returns Objet contenant la fonction de soumission et les états associés
 * 
 * @example
 * ```jsx
 * const { location, loading, error } = useReadLocations(1);
 * ```
 */
export function useReadLocations(id:number) {
    const [location, setLocation] = useState<Location | null>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
          try {
            setLoading(true);
            const response = await getLocation(id);
            if (
              response.statusCode === 200 &&
              response.data
            ) {
              setLocation(response.data.data);
              setError(null);
            } else if (response.statusCode === 404) {
              setLocation(null);
              setError(null);
            } else {
              setError("Erreur lors du chargement du lieux.");
            }
          } catch (err) {
            console.error("Erreur API :", err);
            setError("Erreur lors de l'appel API.");
          } finally {
            setLoading(false);
          }
        };
    
        load();
      }, [id]);
    
      return { location, loading, error };
}
