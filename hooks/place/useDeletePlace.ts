import { deletePlace } from "@/services/placeServices";
import { getApiMessage, isApiError } from "@/utils/apiResponseHelpers";
import { useState } from "react";

/**
 * Hook pour gérer la suppression d'un lieu ou événement avec gestion des erreurs.
 * @version 1.0
 * @date 2025-05-01
 * 
 * @example
 * ```jsx
 * const { removeLocationOrEvent, loading, error, success } = useDeleteLocationOrEvent();
 * async function handleSubmit() {
 *      if (!token) {
 *          console.error("Token manquant : authentification requise");
 *          return;
 *      }
 *      await removeLocationOrEvent(78, token);
 * }
 * if (error) {
 *      console.log("Erreur générale :", error);
 * }
 * if (loading) {
 *      console.log("Chargment...")
 * }
 * if (success) {
 *      console.log("Tout est ok")
 * }
 * ```
 */
export function useDeletePlaceOrEvent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // erreur globale
    const [success, setSuccess] = useState(false);

    /**
     * Soumet la suppression du lieu ou de l'événement à l'API.
     * @param id `number` - L'identifiant du lieu ou de l'événement à supprimer.
     * @param token `string` - Le token d'authentification.
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
                setError(getApiMessage(response) || "Erreur inattendue lors de l'ajout.");
            }
        } catch (err) {
            console.error("Erreur API :", err);
            setError("Erreur lors de l'appel à l'API.");
        } finally {
            setLoading(false);
        }
    }

    return { removePlaceOrEvent, loading, error, success }
}