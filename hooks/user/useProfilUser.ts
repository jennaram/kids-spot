import { useEffect, useState } from 'react';
import { ProfilUser } from '@/types/user';
import { profilUser } from '@/services/userServices';
export function useProfilUser(token: string) {
    const [loading, setLoading] = useState(false);
    const [profil, setProfil] = useState<ProfilUser |null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfil = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await profilUser(token);
                if (response.statusCode === 200 && response.data) {
                    setProfil(response.data.data);
                } else {
                    setError('Erreur lors de la récupération des données');
                }
            } catch (err) {
                setError('Erreur lors de la récupération des données');
            } finally {
                setLoading(false);
            }
        }
        if (token) {
            fetchProfil();
        }

    }, [token]);
    return {
        loading,
        profil,
        error,
    };
}