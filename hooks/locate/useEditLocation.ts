import { editLocationOrEvent } from '@/services/locationsServices';
import { UpdateLocationOrEventPayload } from '@/types/location';
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
* const { updateLocationOrEvent, loading, error, success, fieldErrors } = useEditLocationOrEvent();
* async function handleSubmit() {
*    if (!token) {
*      console.error("Token manquant : authentification requise");
*      return;
*    }
*    await submitLocationOrEvent(
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
*        date_debut: "date de début de l'évenememt" // optionnel
*        date_fin: "date de fin de l'événement" // optionnel
*      }, token);
* }
* 
* if(error){
*    console.log("Erreur générale :", error);
*    console.log(fieldErrors)
* }
* 
* if(loading){
*    console.log("Chargment...")
* }
* 
* if(success){
*    console.log("Tout est ok")
* }
* ```
*/
export function useEditLocationOrEvent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // erreur globale
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}); // erreurs par champ
    const [success, setSuccess] = useState(false);

    /**
    * Soumet les données du lieu ou de l'événement à l'API.
    * 
    * @param data - L'objet contenant les informations du lieu ou de l'événement à ajouter.
    * Les propriétés attendues sont :
    * - `id`: `number`- L'identifient du lieu
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
    * - `date_debut`: `string` - (optionnel) - La date de début de l'événement
    * - `date_fin`: `string` - (optionnel) - La date de fin de l'événement
    * @param token - Le token d'authentification.
    */
    const updateLocationOrEvent = async (data: UpdateLocationOrEventPayload, token: string) => {
        setLoading(true);
        setError(null);
        setFieldErrors({});
        setSuccess(false);

        try {
            const response = await editLocationOrEvent(data, token);
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
                setError(getApiMessage(response) || "Erreur inattendue lors de l'ajout.");
            }
        } catch (err) {
            setError(handleApiError(err));
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return { updateLocationOrEvent, loading, error, fieldErrors, success };
}
