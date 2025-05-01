import { addLocationOrEvent } from "@/services/locationsServices";
import { AddLocationOrEventPayload } from "@/types/location";
import { getApiMessage, isApiError } from "@/utils/apiResponseHelpers";
import { handleApiError } from "@/utils/handleApiError";
import { useState } from "react";

/**
 * Hook pour gérer l'ajout d'un lieu ou événement avec gestion des erreurs globales et par champ
 */
export function useAddLocationOrEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // erreur globale
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}); // erreurs par champ
  const [success, setSuccess] = useState(false);

  const submitLocationOrEvent = async (data: AddLocationOrEventPayload, token: string) => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      const response = await addLocationOrEvent(data, token);

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

  return { submitLocationOrEvent, loading, error, fieldErrors, success };
}