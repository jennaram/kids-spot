import { useState } from 'react';
import { loginUser } from '@/services/userServices';
import { AuthResult } from '@/types/user';

export function useLoginUser() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AuthResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);

  async function submit(email: string, password: string) {
    setLoading(true);
    setError(null);
    setFieldErrors(null);
    try {
      const response = await loginUser(email, password);
      if (response.statusCode === 200 && response.data) {
        setData(response.data);
      } else {
        setError('Échec de la connexion');
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