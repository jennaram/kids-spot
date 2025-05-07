import { useState } from "react";

export function useGeocodeAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function geocode(address: string): Promise<{ lat: number; lon: number } | null> {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        setError('Adresse non trouvée');
        return null;
      }
    } catch (err) {
      setError('Erreur lors de la géolocalisation');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { geocode, loading, error };
}