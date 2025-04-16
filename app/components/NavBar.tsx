import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavBarProps {
  onMapPress: () => void;
  onCalendarPress: () => void;
  onAddPress: () => void;
  onFavoritePress: () => void;
  activeTab?: 'map' | 'calendar' | 'add' | 'favorite';
}

const NavBar: React.FC<NavBarProps> = ({
  onMapPress,
  onCalendarPress,
  onAddPress,
  onFavoritePress,
  activeTab = 'map',
}) => {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'map' && styles.activeItem]}
        onPress={onMapPress} // Appelle la fonction pour naviguer vers "main"
      >
        <Ionicons
          name="map-outline"
          size={26}
          color={activeTab === 'map' ? '#FFFFFF' : '#E0E0E0'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, activeTab === 'calendar' && styles.activeItem]}
        onPress={onCalendarPress}
      >
        <Ionicons
          name="calendar-outline"
          size={26}
          color={activeTab === 'calendar' ? '#FFFFFF' : '#E0E0E0'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, activeTab === 'add' && styles.activeItem]}
        onPress={onAddPress}
      >
        <Ionicons
          name="add-circle-outline"
          size={26}
          color={activeTab === 'add' ? '#FFFFFF' : '#E0E0E0'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, activeTab === 'favorite' && styles.activeItem]}
        onPress={onFavoritePress}
      >
        <Ionicons
          name="heart-outline"
          size={26}
          color={activeTab === 'favorite' ? '#FFFFFF' : '#E0E0E0'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    backgroundColor: '#2D5E3D',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
    position: 'absolute', // Position absolue
    bottom: 0, // Place la NavBar en bas de l'écran
    left: 0, // S'assure qu'elle est alignée à gauche
    right: 0,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeItem: {
    backgroundColor: '#1E4D2B', // Exemple de style pour l'élément actif
    borderRadius: 10,
  },
});

export default NavBar;