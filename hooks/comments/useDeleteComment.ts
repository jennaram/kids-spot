import { useState } from "react";
import { deleteComment } from "@/services/commentsServices";

/**
 * Hook pour gérer l'état et la logique de la suppression d'un commentaire
 * @returns Objet contenant la fonction de soumission et les états associés
 * 
 * @example
 * ```jsx
 * const { removeComment, loading, success, error } = useDeleteComment();
 * removeComment(19, token);
 * ```
 */
export function useDeleteComment() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeComment = async (id: number, token: string) => {
    try {
      setLoading(true);
      setSuccess(false);
      setError(null);

      const response = await deleteComment(id, token);

      if (response.statusCode === 204) {
        setSuccess(true);
      } else {
        setError("Erreur lors de la suppression du commentaire.");
      }
    } catch (err) {
      console.error("Erreur API :", err);
      setError("Erreur lors de l'appel à l'API.");
    } finally {
      setLoading(false);
    }
  };

  return { removeComment, loading, success, error };
}