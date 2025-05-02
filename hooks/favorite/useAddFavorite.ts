import { addFavorite } from "@/services/favoritesServices";
import { getApiMessage, isApiError, isApiSuccess } from "@/utils/apiResponseHelpers";
import { useState } from "react";

/**
 * Hook pour gérer l'état et la logique d'ajout d'un favori
 * @returns Objet contenant la fonction de soumission et les états associés
 * 
 * @example
 * ```jsx
 * const { submitFavorite, loading, success, error } = useAddFavorite();
 * const handleSubmit = () => {
 *  submitFavorite(4, userToken);
 * };
 * ```
 */
export function useAddFavorite() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitFavorite = async (id: number, token: string) => {
        setLoading(true);
        setSuccess(false);
        setError(null);

        try {
            const response = await addFavorite(id, token);
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
    }
    return { submitFavorite, loading, success, error };
}
