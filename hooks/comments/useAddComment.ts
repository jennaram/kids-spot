import { useState } from "react";
import { addComment } from "@/api/commentsServices";

export function useAddComment() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitComment = async (
    id_lieu: number,
    commentaire: string,
    note: number,
    token: string
  ) => {
    try {
      setLoading(true);
      setSuccess(false);
      setError(null);

      const response = await addComment(id_lieu, commentaire, note, token);

      if (response.statusCode === 201) {
        setSuccess(true);
      } else {
        setError("Erreur lors de l’ajout du commentaire.");
      }
    } catch (err) {
      console.error("Erreur API :", err);
      setError("Erreur lors de l’appel à l’API.");
    } finally {
      setLoading(false);
    }
  };

  return { submitComment, loading, success, error };
}