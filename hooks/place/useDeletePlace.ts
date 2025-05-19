import { deletePlace } from "@/services/placeServices";
import { getApiMessage, isApiError } from "@/utils/apiResponseHelpers";
import { handleApiError } from "@/utils/handleApiError";
import { useState } from "react";

/**
 * Hook pour gérer la suppression d'un lieu ou événement avec gestion des erreurs.
 * @version 1.0
 * @date 2025-05-01
 * 
 * @example
 * ```jsx
 * const { removePlaceOrEvent, loading, error, success } = useDeletePlaceOrEvent();
 * 
 * async function handleDelete() {
 *    if (!token) {
 *      console.error("Token manquant : authentification requise");
 *      return;
 *    }
 *    await removePlaceOrEvent(78, token);
 * }
 * 
 * if (error) {
 *    console.log("Erreur générale :", error);
 * }
 * 
 * if (loading) {
 *    console.log("Chargement...");
 * }
 * 
 * if (success) {
 *    console.log("Suppression réussie");
 * }
 * ```
 * @returns Un objet contenant les fonctions et états pour gérer la suppression d'un lieu ou événement
 */
export function useDeletePlaceOrEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // erreur globale
  const [success, setSuccess] = useState(false);

  /**
   * Soumet la suppression du lieu ou de l'événement à l'API.
   * @param id - L'identifiant numérique du lieu ou de l'événement à supprimer.
   * @param token - Le token d'authentification JWT requis pour l'API.
   * @returns Une promesse résolue après la tentative de suppression.
   */
  const removePlaceOrEvent = async (id: number, token: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await deletePlace(id, token);
      
      if (response.statusCode === 204) {
        setSuccess(true);
      } else if (isApiError(response)) {
        setSuccess(false);
        setError(getApiMessage(response));
      } else {
        setSuccess(false);
        setError(getApiMessage(response) || "Erreur inattendue lors de la suppression.");
      }
    } catch (err) {
      setError(handleApiError(err));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { removePlaceOrEvent, loading, error, success };
}