import { useState } from "react";
import { addComment } from "@/services/commentsServices";
import { isApiSuccess, isApiError, getApiMessage } from "@/utils/apiResponseHelpers";
import { AddComment } from "@/Types/comment";

/**
 * Hook pour gérer l'état et la logique d'ajout d'un commentaire
 * @returns Objet contenant la fonction de soumission et les états associés
 * 
 * @example
 * ```jsx
 * const { submitComment, loading, success, error } = useAddComment();
 * const handleSubmit = () => {
 *  submitComment(4, "Très sympa", 5, userToken);
 * };
 * ```
 */
export function useAddComment() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitComment = async (data: AddComment, token: string) => {
    try {
      setLoading(true);
      setSuccess(false);
      setError(null);

      const response = await addComment(data, token);

      if (response.statusCode === 201) {
        if (isApiSuccess(response)) {
          setSuccess(true);
        } else if (isApiError(response)) {
          setSuccess(false);
          setError(getApiMessage(response));
        }
      } else {
        setSuccess(false);
        setError(getApiMessage(response) || "Erreur inattendue lors de l’ajout.");
      }
    } catch (err) {
      console.error("Erreur API :", err);
      setSuccess(false);
      setError("Erreur lors de l'appel à l'API.");
    } finally {
      setLoading(false);
    }
  };

  return { submitComment, loading, success, error };
}