import { fetchNearbyFavorites } from "@/services/favoritesServices";
import { Place } from "@/types/place";
import { useEffect, useState } from "react";

export function useReadAllFavorites(lat: number, lgt: number, token: string, trigger: number) {
    const [favoris, setFavoris] = useState<Place[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      if (!token) {
        // Aucun jeton = aucun appel
        setFavoris([]);
        setLoading(false);
        setError(null);
        return;
      }
  
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
    }, [lat, lgt, token, trigger]);
  
    return { favoris, loading, error };
  }