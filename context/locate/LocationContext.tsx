// context/location/LocationContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import getUserLocation from '@/services/localisation';
import fetchNearbyPlaces from '@/api/fetchNearbyPlaces';
import fetchFavorites from '@/api/fetchFavorites';
import { useAuth } from '@/context/auth/AuthContext';

type Location = {
  latitude: number;
  longitude: number;
};

type LocationContextType = {
  userLocation: Location | null;
  nearbyPlaces: any[] | null;
  favorites: any[] | null;
  error: string | null;
  refreshLocation: () => void;
};

const LocationContext = createContext<LocationContextType>({
  userLocation: null,
  nearbyPlaces: null,
  favorites: null,
  error: null,
  refreshLocation: () => { },
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<any[] | null>(null);
  const { token } = useAuth();

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
      if (token) {
        loadFavorites(location.latitude, location.longitude, token); // <<< charge les favoris si connecté
      }
    } else {
      setError("Impossible d'obtenir la localisation.");
    }
  };

  const loadFavorites = async (latitude :number , longitude:number, token: string) => {
    const favoritesData = await fetchFavorites(latitude, longitude, token);
    if (favoritesData && favoritesData.status === 'success') {
      setFavorites(favoritesData.data);
    } else {
      console.error('Erreur lors de la récupération des favoris');
    }
  };

  useEffect(() => {
    fetchLocationAndPlaces();
  }, []);

  // Si il y a un token et la localisation
  useEffect(() => {
    if (token && userLocation) {
      loadFavorites(userLocation.latitude, userLocation.longitude, token);
    }
  }, [token, userLocation]);

  // S'il n'y pas de token
  useEffect(() => {
    if (!token) {
      setFavorites(null);
    }
  }, [token]);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        nearbyPlaces,
        favorites,
        error,
        refreshLocation: fetchLocationAndPlaces,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};