import { useEffect, useState } from "react";
import { fetchAllComments } from "@/services/commentsServices";
import type { Comment } from "@/types/comment";

/**
 * Hook pour gérer l'état et la logique de la lecture de tous les commentaires sur un lieux
 * @returns Objet contenant la fonction de soumission et les états associés
 * 
 * @example
 * ```jsx
 * const { comments, average, loading, error } = useReadAllComments(4);
 * ```
 */
export function useReadAllComments(id_lieu: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchAllComments(id_lieu);

        if (
          response.statusCode === 200 &&
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.commentaires)
        ) {
          setComments(response.data.data.commentaires);
          setAverage(parseFloat(response.data.data.moyenne_notes || "0"));
          setError(null);
        } else if (response.statusCode === 404) {
          setComments([]);
          setAverage(null);
          setError(null);
        } else {
          setError("Erreur lors du chargement des commentaires.");
        }
      } catch (err) {
        console.error("Erreur API :", err);
        setError("Erreur lors de l'appel API.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id_lieu]);

  return { comments, average, loading, error };
}