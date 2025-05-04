import { useState } from 'react';
import { RegisterUser } from '@/types/user';
import { registerUser } from '@/services/userServices';
import { ApiResponseSuccessOnly } from '@/types/api-response';

export function useRegisterUser() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponseSuccessOnly | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);

  async function submit(userData: RegisterUser) {
    setLoading(true);
    setError(null);
    setFieldErrors(null);
    try {
      const response = await registerUser(userData);
      console.log(response)
      if (response.statusCode === 201 && response.data) {
        setData(response.data);
      } else {
        setError('Une erreur est survenue lors de l’inscription');
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

  return { submit, loading, data, error, fieldErrors };
}