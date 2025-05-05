import { editPlaceOrEvent } from '@/services/placeServices';
import { UpdatePlaceOrEventPayload } from '@/types/place';
import { getApiMessage, isApiError } from '@/utils/apiResponseHelpers';
import { handleApiError } from '@/utils/handleApiError';
import { useState } from "react";

/**
 * Hook pour gérer l'édition d'un lieu ou événement avec gestion des erreurs globales et par champ
 * @version 1.0
 * @date 2025-05-01
 * 
 * @example
 * ```jsx
 * const { updatePlaceOrEvent, loading, error, success, fieldErrors } = useEditPlaceOrEvent();
 * 
 * async function handleSubmit() {
 *    if (!token) {
 *      console.error("Token manquant : authentification requise");
 *      return;
 *    }
 *    await updatePlaceOrEvent(
 *      {
 *        id: 1,
 *        nom: "Nom du lieu",
 *        description: "Description du lieu",
 *        horaires: "Les horaires",
 *        adresse: "L'adresse",
 *        ville: "La ville",
 *        code_postal: "Le code postal",
 *        longitude: 2,
 *        latitude: 2,
 *        telephone: "Numéro de téléphone",
 *        site_web: "https://adresse.fr",
 *        id_type: 1,
 *        equipements: [1],
 *        tranches_age: [2],
 *        date_debut: "2025-06-01", // optionnel
 *        date_fin: "2025-06-05" // optionnel
 *      }, token);
 * }
 * 
 * if (error) {
 *    console.log("Erreur générale :", error);
 *    console.log(fieldErrors);
 * }
 * 
 * if (loading) {
 *    console.log("Chargement...");
 * }
 * 
 * if (success) {
 *    console.log("Modification réussie");
 * }
 * ```
 * @returns Un objet contenant les fonctions et états pour gérer l'édition d'un lieu ou événement
 */
export function useEditPlaceOrEvent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // erreur globale
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}); // erreurs par champ
    const [success, setSuccess] = useState(false);

    /**
     * Soumet les données modifiées du lieu ou de l'événement à l'API.
     * 
     * @param data - L'objet contenant les informations du lieu ou de l'événement à modifier.
     * Les propriétés attendues sont :
     * - `id`: `number` - L'identifiant du lieu ou de l'événement à modifier.
     * - `nom`: `string` - Le nom du lieu ou de l'événement.
     * - `description`: `string` - Une description du lieu ou de l'événement.
     * - `horaires`: `string` - Les horaires d'ouverture ou l'heure de l'événement.
     * - `adresse`: `string` - L'adresse du lieu.
     * - `ville`: `string` - La ville du lieu.
     * - `code_postal`: `string` - Le code postal du lieu.
     * - `longitude`: `number` - La longitude du lieu.
     * - `latitude`: `number` - La latitude du lieu.
     * - `telephone`: `string` - Le numéro de téléphone du lieu.
     * - `site_web`: `string` - L'URL du site web du lieu.
     * - `id_type`: `number` - L'identifiant du type de lieu ou d'événement.
     * - `equipements`: `number[]` - Un tableau d'identifiants des équipements disponibles.
     * - `tranches_age`: `number[]` - Un tableau d'identifiants des tranches d'âge concernées.
     * - `date_debut`: `string` - (optionnel) - La date de début de l'événement au format YYYY-MM-DD.
     * - `date_fin`: `string` - (optionnel) - La date de fin de l'événement au format YYYY-MM-DD.
     * @param token - Le token d'authentification JWT requis pour l'API.
     * @returns Une promesse résolue après la tentative de modification.
     */
    const updatePlaceOrEvent = async (data: UpdatePlaceOrEventPayload, token: string) => {
        setLoading(true);
        setError(null);
        setFieldErrors({});
        setSuccess(false);

        try {
            const response = await editPlaceOrEvent(data, token);
            if (response.statusCode === 201 || response.statusCode === 200) {
                setSuccess(true);
            } else if (isApiError(response)) {
                setSuccess(false);
                setError(getApiMessage(response));
                if (response.data?.errors) {
                    setFieldErrors(response.data.errors);
                }
            } else {
                setSuccess(false);
                setError(getApiMessage(response) || "Erreur inattendue lors de la modification.");
            }
        } catch (err) {
            setError(handleApiError(err));
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return { updatePlaceOrEvent, loading, error, fieldErrors, success };
}
