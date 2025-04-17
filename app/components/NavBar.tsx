// Importation des composants et bibliothèques nécessaires
import React from 'react';
// React est la bibliothèque principale pour créer des composants

import { View, TouchableOpacity, StyleSheet } from 'react-native';
// View: conteneur de base pour structurer l'interface (équivalent à une div en HTML)
// TouchableOpacity: élément cliquable qui devient légèrement transparent lors du clic
// StyleSheet: API pour créer et gérer les styles CSS-like

import { Ionicons } from '@expo/vector-icons';
// Ionicons: bibliothèque d'icônes fournie par Expo
// Cette ligne importe des icônes prêtes à l'emploi pour l'interface utilisateur

// Interface TypeScript définissant les propriétés du composant NavBar
// Cela garantit que le composant reçoit toutes les propriétés requises avec les bons types
interface NavBarProps {
  onMapPress: () => void;      // Fonction à appeler quand l'icône de carte est pressée
  onCalendarPress: () => void; // Fonction à appeler quand l'icône de calendrier est pressée
  onAddPress: () => void;      // Fonction à appeler quand l'icône d'ajout est pressée
  onFavoritePress: () => void; // Fonction à appeler quand l'icône de favoris est pressée
  activeTab?: 'map' | 'calendar' | 'add' | 'favorite'; // Onglet actuellement actif (optionnel)
}

// Définition du composant NavBar comme composant fonctionnel avec les propriétés typées
// React.FC<NavBarProps> signifie "Functional Component" avec les propriétés de type NavBarProps
const NavBar: React.FC<NavBarProps> = ({
  onMapPress,
  onCalendarPress,
  onAddPress,
  onFavoritePress,
  activeTab = 'map', // Valeur par défaut si activeTab n'est pas fourni
}) => {
  return (
    // Container principal de la barre de navigation
    <View style={styles.navContainer}>
      {/* Bouton pour l'onglet Carte */}
      <TouchableOpacity
        // Applique les styles de navItem et, si l'onglet est actif, ajoute également les styles activeItem
        style={[styles.navItem, activeTab === 'map' && styles.activeItem]}
        onPress={onMapPress} // Appelle la fonction pour naviguer vers la carte
      >
        <Ionicons
          name="map-outline" // Nom de l'icône de la bibliothèque Ionicons
          size={26}          // Taille de l'icône en pixels
          color={activeTab === 'map' ? '#FFFFFF' : '#E0E0E0'} // Couleur blanche si actif, gris clair sinon
        />
      </TouchableOpacity>

      {/* Bouton pour l'onglet Calendrier */}
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'calendar' && styles.activeItem]}
        onPress={onCalendarPress} // Appelle la fonction pour naviguer vers le calendrier
      >
        <Ionicons
          name="calendar-outline"
          size={26}
          color={activeTab === 'calendar' ? '#FFFFFF' : '#E0E0E0'}
        />
      </TouchableOpacity>

      {/* Bouton pour l'onglet Ajouter */}
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'add' && styles.activeItem]}
        onPress={onAddPress} // Appelle la fonction pour naviguer vers la page d'ajout
      >
        <Ionicons
          name="add-circle-outline"
          size={26}
          color={activeTab === 'add' ? '#FFFFFF' : '#E0E0E0'}
        />
      </TouchableOpacity>

      {/* Bouton pour l'onglet Favoris */}
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'favorite' && styles.activeItem]}
        onPress={onFavoritePress} // Appelle la fonction pour naviguer vers les favoris
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


// StyleSheet.create permet d'optimiser les performances des styles
const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',      // Aligne les éléments horizontalement (de gauche à droite)
    backgroundColor: '#2D5E3D', 
    height: 60,                // Hauteur fixe de la barre de navigation
    justifyContent: 'space-around', // Distribue l'espace également entre les éléments
    alignItems: 'center',      
    paddingHorizontal: 10,     
    width: '100%',             
    position: 'absolute',      
    bottom: 0,                 
    left: 0,                  
    right: 0,                  
  },
  navItem: {
    flex: 1,                   // Chaque élément prend une part égale de l'espace disponible
    justifyContent: 'center',  
    alignItems: 'center',     
    paddingVertical: 10,       
  },
  activeItem: {
    backgroundColor: '#1E4D2B', 
    borderRadius: 10,         
  },
});

// Exporte le composant pour pouvoir l'utiliser dans d'autres fichiers
export default NavBar;