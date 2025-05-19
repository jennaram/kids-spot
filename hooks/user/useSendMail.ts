import { sendMail } from "@/services/userServices";
import { getApiMessage, isApiError } from "@/utils/apiResponseHelpers";
import { useState } from "react";

export function useSendMAil() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);
    const [success, setSuccess] = useState(false);

    async function send(mail: string) {
        setLoading(true);
        setError(null);
        setFieldErrors(null);

        try {
            const response = await sendMail(mail);
            //console.log(response)
            if (response.statusCode === 201 && response.data) {
                setSuccess(true);
            } else if (isApiError(response)) {
                setSuccess(false);
                setError(getApiMessage(response));
                if (response.data?.errors) {
                    setFieldErrors(response.data.errors);
                }
            } else {
                setSuccess(false);
                setError(getApiMessage(response) || "Erreur inattendue lors l'envoie de l'email.");
            }

        } catch (err: any) {
            setError(err.message || 'Erreur inconnue');
            if (err.errors) {
                setFieldErrors(err.errors);
            }
        } finally {
            setLoading(false);
        }
    }

    return { send, loading, error, fieldErrors, success }
}