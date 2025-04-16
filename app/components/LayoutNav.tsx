// Importation des modules nécessaires
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import NavBar from './NavBar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: 'map' | 'calendar' | 'add' | 'favorite';
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab }) => {
  const router = useRouter(); // Utilisation de useRouter pour la navigation

  return (
    <View style={styles.container}>
      {/* Contenu principal */}
      <View style={styles.content}>{children}</View>

      {/* Barre de navigation */}
      <NavBar
        activeTab={activeTab}
        onMapPress={() => router.push('main')} // Navigue vers main.tsx
        onCalendarPress={() => router.push('/calendar')} // Navigue vers calendar.tsx
        onAddPress={() => router.push('add-place')} // Navigue vers add.tsx
        onFavoritePress={() => router.push('/favorites')} // Navigue vers favorites.tsx
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default Layout;