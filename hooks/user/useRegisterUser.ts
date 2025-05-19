import { useState } from 'react';
import { RegisterUser } from '@/Types/user';
import { registerUser } from '@/services/userServices';
import { ApiResponseSuccessOnly } from '@/Types/api-response';
import { getApiMessage, isApiError } from '@/utils/apiResponseHelpers';

export function useRegisterUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(userData: RegisterUser) {
    setLoading(true);
    setError(null);
    setFieldErrors(null);
    try {
      const response = await registerUser(userData);
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
        setError(getApiMessage(response) || "Erreur inattendue lors de l'ajout.");
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

  return { submit, loading, success, error, fieldErrors };
}