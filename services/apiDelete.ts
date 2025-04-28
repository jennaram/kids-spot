import { API_BASE_URL } from '@/api/apiConfig';

export async function apiDelete(endpoint: string, body: object, token?: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de l\'appel API');
        }

        // Pour le code 204 No Content : ne pas essayer de parser du JSON
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur API DELETE:', error);
        throw error;
    }
}