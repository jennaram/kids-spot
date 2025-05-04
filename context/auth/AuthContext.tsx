// src/context/auth/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

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
  const logoutTimeout = useRef<number | null>(null);

  const checkTokenValidity = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const expirationDate = await AsyncStorage.getItem('tokenExpirationDate');

      if (storedToken && expirationDate) {
        const expirationTime = new Date(expirationDate).getTime();
        const currentTime = Date.now();

        if (currentTime < expirationTime) {
          const remainingTime = expirationTime - currentTime;
          setTokenState(storedToken);

          console.log("Date de fin du token (restauré) :", new Date(expirationTime).toLocaleString());

          logoutTimeout.current = setTimeout(() => {
            console.log("Token expiré automatiquement");
            setToken(null);
          }, remainingTime);
        } else {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('tokenExpirationDate');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du token :', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkTokenValidity();
    return () => {
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    };
  }, []);

  const setToken = async (newToken: string | null, expirationDuration: number | null = null) => {
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);

    if (newToken) {
      const duration = expirationDuration ?? 3600 * 1; // 1h par défaut
      const expirationDate = new Date(Date.now() + duration);
      const expirationISOString = expirationDate.toISOString();

      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('tokenExpirationDate', expirationISOString);

      console.log("Date de fin du token (défini) :", expirationDate.toLocaleString());

      logoutTimeout.current = setTimeout(() => {
        console.log("Token expiré automatiquement (via setToken)");
        router.push('accueil');
        setToken(null);

      }, duration);

      setTokenState(newToken);
    } else {
      console.log("Suppression du token");
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('tokenExpirationDate');
      setTokenState(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};