// Configuration de l'API
const isDev = __DEV__;

export const API_CONFIG = {
  baseUrl: isDev ? 'http://localhost:3000' : 'https://api.kidspot.fr',
  endpoints: {
    email: '/api/notifications/email',
    // Ajoutez d'autres endpoints ici
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

export const getApiUrl = (endpoint: keyof typeof API_CONFIG['endpoints']) => {
  return `${API_CONFIG.baseUrl}${API_CONFIG.endpoints[endpoint]}`;
};
