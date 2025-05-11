import { sendMail } from "@/services/placeServices";
import { getApiMessage, isApiError } from "@/utils/apiResponseHelpers";
import { handleApiError } from "@/utils/handleApiError";
import { useState } from "react";

export function useSendMail() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);

    const submitMail = async (sujet: string, contenueHTML: string, token:string) => {
        setLoading(true);
        setError(null);
        setFieldErrors({});
        setSuccess(false);
        try {
            const response = await sendMail(sujet, contenueHTML, token);

            if(response.statusCode === 200){
                setSuccess(true)
            } else if(isApiError(response)){
                setSuccess(false);
                setError(getApiMessage(response));
                if(response.data?.errors){
                    setFieldErrors(response.data.errors);
                }
            } else{
                setSuccess(false);
                setError(getApiMessage(response) || "Erreur inattendue lors de l'envoie de mail");
            }
        } catch (err){
            setError(handleApiError(err));
            setSuccess(false);
        } finally{
            setLoading(false);
        }
    };

    return { submitMail, loading, error, fieldErrors, success};
}