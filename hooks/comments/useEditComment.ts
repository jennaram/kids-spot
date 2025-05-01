import { useState } from "react";
import { putComment } from "@/services/commentsServices";
import { isApiSuccess, isApiError, getApiMessage } from "@/utils/apiResponseHelpers";

/**
 * Hook pour gérer l'état et la logique d'édition' d'un commentaire
 * @returns Objet contenant la fonction de soumission et les états associés
 * 
 * @example
 * ```jsx
 * const { updateComment, loading, success, error } = useUpdateComment();
 * updateComment(19, "Mise à jour du commentaire", 4, token);
 * ```
 */
export function useEditComment() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateComment = async (
    id: number,
    commentaire: string,
    note: number,
    token: string
  ) => {
    try {
      setLoading(true);
      setSuccess(false);
      setError(null);

      const response = await putComment(id, commentaire, note, token);

      if (response.statusCode === 200) {
        if (isApiSuccess(response)) {
          setSuccess(true);
        } else if (isApiError(response)) {
          setError(getApiMessage(response));
        }
      } else {
        setError(getApiMessage(response) || "Erreur inattendue lors de la modification.");
      }
    } catch (err) {
      console.error("Erreur API :", err);
      setError("Erreur lors de l'appel à l'API.");
    } finally {
      setLoading(false);
    }
  };

  return { updateComment, loading, success, error };
}