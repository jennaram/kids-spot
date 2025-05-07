import { apiGet, apiPost } from '@/services/apiClient';
import { ApiResponse } from '@/Types/api-response';

interface ProfilData {
  id: number;
  pseudo: string;
  mail: string;
  telephone?: string;
  nombre_avis: number;
}

export const getProfil = async (): Promise<ApiResponse<ProfilData>> => {
  try {
    const response = await apiGet('profil/get.php');
    
    // Debug: Afficher la réponse brute
    const rawResponse = await response.text();
    console.log('Raw API response:', rawResponse);

    // Vérifier si c'est du HTML
    if (rawResponse.startsWith('<!DOCTYPE') || rawResponse.startsWith('<html')) {
      throw new Error('Le serveur a renvoyé du HTML au lieu de JSON');
    }

    // Vérifier le Content-Type
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error(`Content-Type invalide: ${contentType}`);
    }

    const data = JSON.parse(rawResponse);
    return {
      success: true,
      data: {
        id: data.id,
        pseudo: data.pseudo,
        mail: data.mail,
        telephone: data.telephone,
        nombre_avis: data.nombre_avis || 0
      }
    };
  } catch (error) {
    console.error('Erreur API détaillée:', error);
    return {
      success: false,
      message: 'Erreur de communication avec le serveur',
      data: null
    };
  }
};