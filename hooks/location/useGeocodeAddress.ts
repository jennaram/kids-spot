import { useState } from 'react';

export function useGeocodeAddress() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function geocode(address: string) {
    setLoading(true);
    setError(null);
    setCoords(null);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setCoords({ lat: parseFloat(lat), lon: parseFloat(lon) });
      } else {
        setError('Adresse non trouvée');
      }
    } catch (err) {
      setError('Erreur lors de la géolocalisation');
    } finally {
      setLoading(false);
    }
  }

  return { geocode, coords, loading, error };
}