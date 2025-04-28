import { API_BASE_URL } from '@/api/apiConfig';

export async function apiPost(endpoint: string, body: object, token?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
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

    return await response.json();
  } catch (error) {
    console.error('Erreur API POST:', error);
    throw error;
  }
}

export async function refreshToken(email: string, password: string) {
  const data = {
    mail: email,
    mot_de_passe: password,
  };
  
  try {
    const response = await apiPost('users/login.php', data);
    
    // Vérifiez que la réponse contient token et expiresIn
    if (response.token && response.expiresIn) {
      return response;  // Retourne la réponse si elle contient les données attendues
    } else {
      throw new Error('La réponse de l\'API est invalide');
    }
  } catch (error) {
    console.error("Erreur dans la fonction refreshToken:", error);
    throw error;
  }
}