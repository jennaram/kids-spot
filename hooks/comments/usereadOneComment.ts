import { useEffect, useState } from "react";
import { fetchComment } from "@/services/commentsServices";
import type { Comment } from "@/Types/comment";

/**
 * Hook pour gérer l'état et la logique de la lecture d'un commentaire
 * @returns Objet contenant la fonction de soumission et les états associés
 * 
 * @example
 * ```jsx
 * const { removeComment, loading, success, error } = useDeleteComment();
 * removeComment(19, token);
 * ```
 */
export function useReadOneComment(id: number) {
  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchComment(id);

        if (response.statusCode === 200 && response.data?.data) {
          setComment(response.data.data);
          setError(null);
        } else {
          setError("Commentaire introuvable.");
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

  return { comment, loading, error };
}