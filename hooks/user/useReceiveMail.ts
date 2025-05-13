import { updateReceiveMailPreference } from "@/services/userServices";
import { getApiMessage, isApiError } from "@/utils/apiResponseHelpers";
import { useState } from "react";

export function useReceiveMail() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState(false);
   const [fieldError, setFieldError] = useState<Record<string, string> | null>(null);

   async function submit (token: string, receiveEmails: boolean) {
         setLoading(true);
         setError(null);
         setFieldError(null);
         setSuccess(false);
    
         try {
            const  reponse  = await updateReceiveMailPreference(token, receiveEmails);
            if (reponse.statusCode === 201 && reponse.data) {
                setSuccess(true);
            }
            else if (isApiError(reponse)) {
                setSuccess(false);
                setError(getApiMessage(reponse));
                if (reponse.data?.errors) {
                    setFieldError(reponse.data.errors);
                }
            }
         } catch (err : any) {
            setSuccess(false);
            setError('Erreur lors de la mise à jour des préférences de réception d\'emails');

         } finally {
                setLoading(false);
         }
   }
   return {
        loading,
        error,
        fieldError,
        success,
        submit,
   }
}

