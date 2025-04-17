import React from 'react';
// React est la bibliothèque principale pour créer des composants

import { View, StyleSheet } from 'react-native';
// View: conteneur fondamental pour structurer l'interface utilisateur

import { useRouter } from 'expo-router';
// useRouter: hook fourni par Expo Router pour gérer la navigation entre les écrans
// Expo Router est une solution de routage pour les applications Expo

import NavBar from './NavBar';
// Importe le composant NavBar, ce composant sera utilisé pour afficher la barre de navigation en bas de l'écran

// Interface TypeScript qui définit les propriétés attendues par le composant Layout
interface LayoutProps {
  children: React.ReactNode;  // Élément(s) enfant(s) qui seront affichés dans le layout
                              // ReactNode est un type qui accepte tout ce qui peut être rendu par React
  
  activeTab?: 'map' | 'calendar' | 'add' | 'favorite';  // Onglet actif (optionnel)
                                                       // Le ? indique que cette propriété est optionnelle
  
  // Fonctions à appeler lorsque les différents onglets sont pressés
  onMapPress: () => void;
  onCalendarPress: () => void;
  onAddPress: () => void;
  onFavoritePress: () => void;
}

// Définition du composant Layout comme composant fonctionnel avec les propriétés typées
const Layout: React.FC<LayoutProps> = ({ children, activeTab }) => {
  // Utilisation du hook useRouter pour avoir accès aux fonctions de navigation
  const router = useRouter();

  return (
    // Container principal qui prend tout l'espace disponible (flex: 1)
    <View style={styles.container}>
      {/* Zone de contenu principal où seront affichés les enfants du composant */}
      <View style={styles.content}>{children}</View>

      {/* Barre de navigation en bas de l'écran */}
      <NavBar
        activeTab={activeTab}  // Passe l'onglet actif au composant NavBar
        
        // Pour chaque onglet, définit une fonction qui navigue vers une page spécifique
        // router.push() change la page actuelle pour celle spécifiée
        onMapPress={() => router.push('main')}         // Navigue vers main.tsx
        onCalendarPress={() => router.push('/calendar')} // Navigue vers evenement.tsx
        onAddPress={() => router.push('add-place')}    // Navigue vers add-place.tsx
        onFavoritePress={() => router.push('/favorites')} // Navigue vers favorites.tsx
      />
    </View>
  );
};

// Définition des styles pour les différents éléments du composant
const styles = StyleSheet.create({
  container: {
    flex: 1,  // Prend tout l'espace disponible sur l'écran
  },
  content: {
    flex: 1,  // Prend tout l'espace disponible dans le conteneur parent
              // Ceci permet au contenu de s'étendre et de remplir l'espace au-dessus de la navbar
  },
});

// Exporte le composant pour pouvoir l'utiliser dans d'autres fichiers
export default Layout;