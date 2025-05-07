import { useEffect, useState } from 'react';
import { ProfilUser } from '@/types/user';
import { profilUser } from '@/services/userServices';
export function useProfilUser(token : string) {
    const [loading, setLoading] = useState(false);
    const [dataProfil, setDataProfil] = useState<ProfilUser>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await profilUser(token);
                if (response.statusCode === 200 && response.data) {
                    console.log(response);
                    setDataProfil(response.data);
                } else {
                    setError('Erreur lors de la récupération des données');
                }
            } catch (err) {
                setError('Erreur lors de la récupération des données');
            } finally {
                setLoading(false);
            }
        }

        load();

    }, [token]);
    


}