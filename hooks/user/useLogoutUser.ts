import { useState } from 'react';
//import { authService } from '@/services/authService';
import { useAuth } from '@/context/auth/AuthContext';

export function useLogoutUser() {
  const { setToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function logout() {
    setLoading(true);
    setError(null);
    try {
      //await authService.logout();
      setToken(null); // Supprime le token du contexte
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  return { logout, loading, error };
}