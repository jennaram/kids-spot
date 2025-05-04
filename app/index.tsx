// src/pages/IndexPage.tsx
import { useEffect } from "react";
import { useRouter } from 'expo-router';
import { useAuth } from "@/context/auth";
import Loader from "@/components/Loader";
//import { refreshToken } from "@/services/apiPost";
//import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IndexPage() {
  const { token, loading, setToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (token) {
        // Si un token existe déjà et est valide, on redirige directement
        router.replace("/Places");
      } else {
        // Ce n'est que si aucun token valide n'existe qu'on tente l'auto-login
        router.replace("/accueil")
      }
    }
  }, [token, loading, router, setToken]);

  if (loading) return <Loader />; // Si on attend que le token soit vérifié

  return <></>;
}