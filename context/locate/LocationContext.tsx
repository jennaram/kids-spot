import React, { createContext, useContext, useEffect, useState } from 'react';
import getUserLocation from '@/services/localisation';
import fetchNearbyPlaces from '@/api/fetchNearbyPlaces';
import { useAuth } from '@/context/auth/AuthContext';
import { fetchNearbyFavorites } from '@/api/favoritesServices';

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
  refreshLocation: () => {},
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[] | null>(null);
  const [favorites, setFavorites] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const loadNearbyPlaces = async (latitude: number, longitude: number) => {
    try {
      const placesData = await fetchNearbyPlaces(latitude, longitude);
      if (placesData?.status === 'success') {
        setNearbyPlaces(placesData.data);
        setError(null);
      } else {
        throw new Error('Échec du chargement des lieux');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la récupération des lieux.');
    }
  };

  const loadFavorites = async (latitude: number, longitude: number, token: string) => {
    try {
      const { statusCode, data } = await fetchNearbyFavorites(latitude, longitude, token);
      if (statusCode >= 200 && statusCode < 300) {
        setFavorites(data.data);
      } else {
        throw new Error('Erreur lors du chargement des favoris');
      }
    } catch (err) {
      console.error(err);
      setFavorites(null); // Optionnel : reset si erreur
    }
  };

  const fetchLocationAndPlaces = async () => {
    try {
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
        await loadNearbyPlaces(location.latitude, location.longitude);
        if (token) {
          await loadFavorites(location.latitude, location.longitude, token);
        }
      } else {
        throw new Error("Localisation indisponible.");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible d'obtenir la localisation.");
    }
  };

  useEffect(() => {
    fetchLocationAndPlaces();
  }, []);

  useEffect(() => {
    if (token && userLocation) {
      loadFavorites(userLocation.latitude, userLocation.longitude, token);
    }
  }, [token, userLocation]);

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