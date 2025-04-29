import { useEffect, useState } from "react";
import { fetchAllComments } from "@/api/commentsServices";
import type { Comment } from "@/Types/comment";

export function useReadAllComments(id_lieu: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchAllComments(id_lieu);
        console.log(response.statusCode);
        
        if (response.statusCode === 200) {
          setComments(response.data.data.commentaires);
          setError(null);
        } else if (response.statusCode === 404) {
          // Aucun commentaire => on considère que c’est "vide", pas une erreur
          setComments([]);
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

  return { comments, loading, error };
}