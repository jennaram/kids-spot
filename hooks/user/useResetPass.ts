import { resetPass } from "@/services/userServices";
import { ResetPass } from "@/Types/user";
import { getApiMessage, isApiError } from "@/utils/apiResponseHelpers";
import { useState } from "react";

export function useResetPass() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);
    const [success, setSuccess] = useState(false);

    /**
     * 
     * @param userData 
     */
    async function submit(userData: ResetPass){
        setLoading(true);
        setError(null);
        setFieldErrors(null);
        try{
            const response = await resetPass(userData);
            //console.log(response);
            if(response.statusCode === 201 && response.data){
                setSuccess(true);
            }else if (isApiError(response)){
                setSuccess(false);
                setError(getApiMessage(response));
                if(response.data?.errors){
                    setFieldErrors(response.data.errors);
                }
            } else{
                setSuccess(false);
                setError(getApiMessage(response)|| "Erreur inattendue lors de l'ajout.")
            }
        } catch (err: any){
            setError(err.message || 'erreur inconnue');
            if(err.errors){
                setFieldErrors(err.errors);
            }
        } finally {
            setLoading(false);
        }
    }

    return {submit, loading, success, error, fieldErrors};
}

