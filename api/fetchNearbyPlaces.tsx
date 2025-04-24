async function fetchNearbyPlaces(latitude: number, longitude: number): Promise<any | null> {
    const apiUrl = `https://seb-prod.alwaysdata.net/kidsspot/lieux/autour/${latitude}/${longitude}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        console.error(`Erreur lors de la requête à l'API: ${response.status}`);
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des données:", error);
      return null;
    }
  }
  
  export default fetchNearbyPlaces;