import { useState } from "react";

export function useGeocodeAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function geocode(address: string): Promise<{ lat: number; lon: number } | null> {
    if (!address || address.trim() === '') {
      setError('L\'adresse ne peut pas être vide');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Tentative de géocodage pour l\'adresse:', address);
      
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=fr`;
      console.log('URL de requête:', url);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'KidsSpot/1.0'
        }
      });

      if (!response.ok) {
        console.error('Erreur de réponse:', response.status, response.statusText);
        setError(`Erreur serveur: ${response.status}`);
        return null;
      }

      const data = await response.json();
      console.log('Réponse du serveur:', data);

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const result = { lat: parseFloat(lat), lon: parseFloat(lon) };
        console.log('Coordonnées trouvées:', result);
        return result;
      } else {
        console.log('Aucune coordonnée trouvée pour cette adresse');
        setError('Adresse non trouvée. Veuillez vérifier l\'adresse et réessayer.');
        return null;
      }
    } catch (err) {
      console.error('Erreur lors du géocodage:', err);
      setError('Erreur lors de la géolocalisation. Veuillez réessayer.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { geocode, loading, error };
}