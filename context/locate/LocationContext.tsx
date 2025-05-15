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
  refreshTrigger: number;
  refreshLocation: () => void;
  refreshFavorites: () => void;
};

const LocationContext = createContext<LocationContextType>({
  userLocation: null,
  nearbyPlaces: null,
  favorites: null,
  loading: true,
  error: null,
  refreshTrigger: 0,
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);


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

  const refreshLocation = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const refreshFavorites = () => {
    setRefreshFavoritesTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // Récupère les lieux à proximité uniquement lorsque la localisation est prête
  const {
    places,
    loading: loadingPlaces,
    error: placesError
  } = useReadAllPlaces(
    locationReady && userLocation?.latitude ? userLocation.latitude : 38.85,
    locationReady && userLocation?.longitude ? userLocation.longitude : 2.34,
    refreshTrigger // Ajout de refreshTrigger comme dépendance
  );

  const { favoris, loading: loadingFavorites, error: favError } = useReadAllFavorites(
    userLocation?.latitude ?? 38.85,
    userLocation?.longitude ?? 2.34,
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
        refreshTrigger, // Exposer refreshTrigger dans le contexte (bien que pas directement utilisé par les consommateurs)
        refreshLocation,
        refreshFavorites
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};