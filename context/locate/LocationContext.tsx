import React, { createContext, useContext, useEffect, useState } from 'react';
import getUserLocation from '@/services/localisation';
import { useAuth } from '@/context/auth/AuthContext';
import { useReadAllPlaces} from '@/hooks/place/useReadAllPlaces';
import { useReadAllFavorites } from '@/hooks/favorite/useReadAllFavorites';

type Location = {
  latitude: number;
  longitude: number;
};

type LocationContextType = {
  userLocation: Location | null;
  nearbyPlaces: any[] | null;
  favorites: any[] | null;
  loading: boolean;
  error: string | null;
  refreshLocation: () => void;
  refreshFavorites: () => void;
};

const LocationContext = createContext<LocationContextType>({
  userLocation: null,
  nearbyPlaces: null,
  favorites: null,
  loading: true,
  error: null,
  refreshLocation: () => {},
  refreshFavorites: () => {},
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [locationReady, setLocationReady] = useState(false);
  const [refreshFavoritesTrigger, setRefreshFavoritesTrigger] = useState(0);
  const { token } = useAuth();

  // Récupère la géolocalisation et met à jour l'état
  const fetchLocation = async () => {
    try {
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
        setLocalError(null);
      } else {
        throw new Error("Localisation indisponible.");
      }
    } catch (err) {
      console.error(err);
      setLocalError("Impossible d'obtenir la localisation.");
      setUserLocation(null);
    } finally {
      setLocationReady(true);
    }
  };

  const refreshFavorites = () => {
    setRefreshFavoritesTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const { places, loading: loadingPlaces, error: placesError } = useReadAllPlaces(
    userLocation?.latitude ?? 0,
    userLocation?.longitude ?? 0
  );

  const { favoris, loading: loadingFavorites, error: favError } = useReadAllFavorites(
    userLocation?.latitude ?? 0,
    userLocation?.longitude ?? 0,
    token ?? '',
    refreshFavoritesTrigger
  );

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        nearbyPlaces: locationReady ? places : null,
        favorites: token && locationReady ? favoris : null,
        loading: !locationReady || loadingPlaces || (token ? loadingFavorites : false),
        error: localError || placesError || favError,
        refreshLocation: fetchLocation,
        refreshFavorites,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};