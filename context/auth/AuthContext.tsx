// src/context/auth/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null, expirationDuration?: number | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer le token et la date d'expiration stockée
  const checkTokenValidity = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const expirationDate = await AsyncStorage.getItem('tokenExpirationDate');
      
      if (token && expirationDate) {
        const expirationTime = new Date(expirationDate).getTime();
        const currentTime = new Date().getTime();

        if (currentTime < expirationTime) {
          // Si le token est encore valide
          setTokenState(token);
        } else {
          // Si le token est expiré, supprimer le token
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('tokenExpirationDate');
        }
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkTokenValidity();
  }, []);

  const setToken = async (token: string | null, expirationDuration: number | null = null) => {
    if (token && expirationDuration) {
      const expirationDate = new Date(new Date().getTime() + expirationDuration).toISOString();
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('tokenExpirationDate', expirationDate);
    } else if (token) {
      // Si on a un token mais pas de durée d'expiration, on utilise une valeur par défaut (1 heure)
      const defaultExpiration = 3600 * 1000; // 1 heure en millisecondes
      const expirationDate = new Date(new Date().getTime() + defaultExpiration).toISOString();
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('tokenExpirationDate', expirationDate);
    } else {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('tokenExpirationDate');
    }
    setTokenState(token);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};