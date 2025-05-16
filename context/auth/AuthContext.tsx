// src/context/auth/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type AuthContextType = {
  token: string | null;
  grade: number | null;
  pseudo: string | null;
  setToken: (token: string | null, grade?: number, pseudo?: string, expirationDuration?: number | null) => void;
  loading: boolean;

};

const AuthContext = createContext<AuthContextType>({
  token: null,
  grade: 0,
  pseudo: null,
  setToken: () => { },
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [grade, setGradeState] = useState<number>(0);
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const logoutTimeout = useRef<number | null>(null);

  const checkTokenValidity = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const expirationDate = await AsyncStorage.getItem('tokenExpirationDate');
      const storedGrade = await AsyncStorage.getItem('grade');
      const storedPseudo = await AsyncStorage.getItem('pseudo');

      if (storedToken && expirationDate) {
        const expirationTime = new Date(expirationDate).getTime();
        const currentTime = Date.now();

        if (currentTime < expirationTime) {
          const remainingTime = expirationTime - currentTime;
          setTokenState(storedToken);
          setGradeState(Number(storedGrade));
          setPseudo(storedPseudo);


          //console.log("Date de fin du token (restauré) :", new Date(expirationTime).toLocaleString());

          logoutTimeout.current = setTimeout(() => {
            console.log("Token expiré automatiquement");
            setToken(null);
            setGradeState(0);
            setPseudo('');
          }, remainingTime);
        } else {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('tokenExpirationDate');
          await AsyncStorage.removeItem('grade');
          await AsyncStorage.removeItem('pseudo');
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

  const setToken = async (newToken: string | null, newGrade: number = 0, newPseudo: string = '', expirationDuration: number | null = null) => {
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);

    if (newToken) {
      const duration = expirationDuration ?? 3600 * 1000; // 1h par défaut
      const expirationDate = new Date(Date.now() + duration);
      const expirationISOString = expirationDate.toISOString();

      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('tokenExpirationDate', expirationISOString);
      await AsyncStorage.setItem('grade', newGrade.toString());
      await AsyncStorage.setItem('pseudo', newPseudo);

      //console.log("Date de fin du token (défini) :", expirationDate.toLocaleString());

      logoutTimeout.current = setTimeout(() => {
        //console.log("Token expiré automatiquement (via setToken)");
        router.push('accueil');
        setToken(null);
        setGradeState(0);
        setPseudo('');
      }, duration);

      setTokenState(newToken);
      setGradeState(newGrade);
      setPseudo(newPseudo);
    } else {
      //console.log("Suppression du token");
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('tokenExpirationDate');
      await AsyncStorage.removeItem('grade');
      await AsyncStorage.removeItem('pseudo');
      setTokenState(null);
      setGradeState(0)
      setPseudo('');
    }
  };


  return (
    <AuthContext.Provider value={{ token, setToken, loading, grade, pseudo }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };