// context/location/LocationContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import getUserLocation from '@/services/localisation'; // 🔁 ton import perso
import fetchNearbyPlaces from '@/api/fetchNearbyPlaces'; // 🔁 ton import perso

type Location = {
  latitude: number;
  longitude: number;
};

type LocationContextType = {
  userLocation: Location | null;
  nearbyPlaces: any[] | null;
  error: string | null;
  refreshLocation: () => void;
};

const LocationContext = createContext<LocationContextType>({
  userLocation: null,
  nearbyPlaces: null,
  error: null,
  refreshLocation: () => {},
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadNearbyPlaces = async (lat: number, lng: number) => {
    const placesData = await fetchNearbyPlaces(lat, lng);
    if (placesData && placesData.status === 'success') {
      setNearbyPlaces(placesData.data);
    } else {
      console.error('Erreur lors de la récupération des lieux');
      setError('Erreur lors de la récupération des lieux.');
    }
  };

  const fetchLocationAndPlaces = async () => {
    const location = await getUserLocation();
    if (location) {
      setUserLocation(location);
      setError(null);
      loadNearbyPlaces(location.latitude, location.longitude);
    } else {
      setError("Impossible d'obtenir la localisation.");
    }
  };

  useEffect(() => {
    fetchLocationAndPlaces();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        nearbyPlaces,
        error,
        refreshLocation: fetchLocationAndPlaces,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};