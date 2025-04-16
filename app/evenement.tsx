// Importation des composants et hooks nécessaires
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
// React Native fournit ces composants de base pour construire l'interface utilisateur mobile

import React, { useState, useRef } from 'react';
// useState permet de gérer l'état local dans un composant fonctionnel
// useRef permet de créer une référence persistante entre les rendus

import { useEffect } from 'react';
// useEffect permet d'exécuter des effets secondaires (comme des appels API) dans les composants

import Layout from './components/LayoutNav';
// Importe le composant personnalisé qui structure la page avec une navigation

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
// importations concernent la navigation dans l'application

// Interface TypeScript définissant la structure d'un objet "Lieu"
// Cela aide à assurer la cohérence des données manipulées
interface Lieu {
  id: number;
  nom: string;
  horaires: string;
  adresse: {
    adresse: string;
    code_postal: string;
    ville: string;
  };
  type: {
    id: number;
    nom: string;
  }[];  // Un tableau de types (chaque type a un id et un nom)
  est_evenement: boolean;  // Indique si le lieu est un événement
  date_evenement: {
    debut: string | null;
    fin: string | null;
  };
  position: {
    latitude: number;
    longitude: number;
    distance_km: number;
  };
  equipements: string[];  // Liste des équipements disponibles
  ages: string[];  // Tranches d'âge concernées
}


// Définition du composant principal "CustomCard"
const CustomCard = () => {
  // État pour stocker les données du lieu récupérées de l'API
  const [lieu, setLieu] = useState<Lieu | null>(null);
  
  // État pour gérer l'animation de retournement de la carte
  const [flipped, setFlipped] = useState(false);
  
  // Référence pour l'animation de retournement
  const flipAnimation = useRef(new Animated.Value(0)).current;
  
  // Hook pour accéder à la navigation
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // useEffect s'exécute après le rendu du composant
  useEffect(() => {
    // Fonction asynchrone pour récupérer des données depuis l'API
    const fetchData = async () => {
      try {
        // Appel à l'API pour obtenir la liste des lieux à proximité
        const response = await fetch('https://seb-prod.alwaysdata.net/kidsspot/lieux/autour/12/12');
        const data = await response.json();
        
        // Recherche du premier lieu qui est un événement
        const event = data.data.find((l: Lieu) => l.est_evenement);
        setLieu(event || null);  // Met à jour l'état avec l'événement trouvé
      } catch (error) {
        // La gestion d'erreur est commentée, mais devrait être activée en production
      }
    };

    // Appelle la fonction fetchData lors du montage du composant
    fetchData();
  }, []);  // Le tableau vide signifie que cet effet ne s'exécute qu'une fois

  // Configuration de l'interpolation pour l'animation de la face avant de la carte
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],  // Valeurs d'entrée
    outputRange: ['0deg', '180deg'],  // Valeurs de sortie correspondantes
  });

  // Configuration de l'interpolation pour l'animation de la face arrière
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  // Fonction pour déclencher l'animation de retournement
  const flipCard = () => {
    // Animation avec un effet de ressort
    Animated.spring(flipAnimation, {
      toValue: flipped ? 0 : 180,  // Bascule entre les deux états
      useNativeDriver: true,  // Utilise le thread natif pour de meilleures performances
    }).start(() => setFlipped(!flipped));  // Met à jour l'état après l'animation
  };

  // Si aucun lieu n'est encore chargé, affiche un indicateur de chargement
  if (!lieu) {
    return (
      <Layout 
        activeTab="calendar"  // Onglet actif dans la navigation
        onMapPress={() => navigation.navigate('Map')}  // Fonction exécutée lors du clic sur l'onglet Map
        onCalendarPress={() => navigation.navigate('Calendar')}
        onAddPress={() => navigation.navigate('Add')}
        onFavoritePress={() => navigation.navigate('Favorites')}
      >
        <View style={styles.centered}>
          <Text>Chargement...</Text>
        </View>
      </Layout>
    );
  }

  // Rendu principal du composant quand les données sont chargées
  return (
    <Layout
      activeTab="calendar" 
      onMapPress={() => navigation.navigate('Map')}
      onCalendarPress={() => navigation.navigate('Calendar')}
      onAddPress={() => navigation.navigate('Add')}
      onFavoritePress={() => navigation.navigate('Favorites')}
    >
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {/* Face avant de la carte */}
          <Animated.View
            style={[
              styles.card,
              { transform: [{ rotateY: frontInterpolate }] },  // Applique la rotation
              { zIndex: flipped ? 0 : 1 },  // Gère la superposition des éléments
            ]}
          >
            <View style={styles.cardContent}>
              <Image
                source={require('../assets/images/Logo.png')}
                style={styles.image}
                resizeMode="contain"  // Ajuste l'image sans la déformer
              />
              <Text style={styles.title}>{lieu.nom}</Text>
              <Text style={styles.date}>{lieu.nom}</Text>  // Note: Répétition du nom, c'est peut-être une erreur
              <TouchableOpacity style={styles.infoButton} onPress={flipCard}>
                <Text style={styles.infoText}>Voir les détails</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Face arrière de la carte */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              { transform: [{ rotateY: backInterpolate }] },
              { position: 'absolute', top: 0 },  // Positionne exactement au-dessus de la face avant
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={styles.modalTitle}>{lieu.nom}</Text>
              <Text style={styles.modalText}>
                {lieu.adresse?.adresse}, {lieu.adresse?.code_postal} {lieu.adresse?.ville}
              </Text>
              <Text style={styles.modalText}>Type : {lieu.type.map(t => t.nom).join(', ')}</Text>
              <Text style={styles.modalText}>
                Équipements : {lieu.equipements?.join(', ') || 'Non spécifiés'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={flipCard}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retour</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </Layout>
  );
};

// Styles pour les différents éléments de l'interface
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,  // Prend tout l'espace disponible
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',  // Centre verticalement
    alignItems: 'center',      // Centre horizontalement
  },
  container: {
    flex: 1,
    paddingBottom: 60,  // Espace en bas pour éviter que la NavBar ne recouvre le contenu
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',  // Centre l'image
    marginBottom: 16,     // Espace en dessous de l'image
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',  // Centre la carte horizontalement
    marginVertical: 20,    // Marges en haut et en bas
  },
  card: {
    width: '90%',           // Largeur de la carte
    height: 250,            // Hauteur fixe
    borderRadius: 16,       // Coins arrondis
    backgroundColor: '#fff',
    shadowColor: '#000',    // Couleur de l'ombre
    shadowOpacity: 0.2,     // Opacité de l'ombre
    shadowOffset: { width: 0, height: 3 },  // Décalage de l'ombre
    shadowRadius: 6,        // Rayon de l'ombre
    elevation: 6,           // Élévation (pour Android)
    justifyContent: 'center',
    backfaceVisibility: 'hidden',  // Cache la face non visible pendant l'animation
  },
  cardBack: {
    backgroundColor: '#f8f9fa',  // Couleur de fond légèrement différente pour la face arrière
  },
  cardContent: {
    padding: 20,  // Espace intérieur
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  infoButton: {
    backgroundColor: '#007bff',  // Bleu
    padding: 10,
    borderRadius: 8,  // Coins arrondis
    alignSelf: 'flex-start',  // Aligne à gauche
  },
  infoText: {
    color: '#fff',  // Texte blanc
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginTop: 10,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 40,
    alignSelf: 'flex-end',  // Aligne à droite
  },
});

// Exporte le composant pour l'utiliser ailleurs
export default CustomCard;