// Importation des modules nécessaires
import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavBar from './NavBar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: 'map' | 'calendar' | 'add' | 'favorite';
  onMapPress: () => void;
  onCalendarPress: () => void;
  onAddPress: () => void;
  onFavoritePress: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  onMapPress,
  onCalendarPress,
  onAddPress,
  onFavoritePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Contenu principal */}
      <View style={styles.content}>{children}</View>

      {/* Barre de navigation */}
      <NavBar
        activeTab={activeTab}
        onMapPress={onMapPress}
        onCalendarPress={onCalendarPress}
        onAddPress={onAddPress}
        onFavoritePress={onFavoritePress}
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