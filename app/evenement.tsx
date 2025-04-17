// Importation des composants et hooks nécessaires
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, SafeAreaView, ScrollView } from 'react-native';
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
  // État pour stocker la liste des lieux (pas juste un seul lieu)
  const [lieux, setLieux] = useState<Lieu[]>([]);
  // État pour gérer quel lieu est actuellement "flippé"
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);
  
  // Référence pour les animations
  const flipAnimations = useRef<{[key: number]: Animated.Value}>({}).current;
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://seb-prod.alwaysdata.net/kidsspot/lieux/autour/12/12');
        const data = await response.json();
        
        // Filtrer pour ne garder que les événements et initialiser les animations
        const events = data.data.filter((l: Lieu) => l.est_evenement);
        events.forEach((event: Lieu) => {
          flipAnimations[event.id] = new Animated.Value(0);
        });
        setLieux(events);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, []);

  const flipCard = (id: number) => {
    const currentValue = flippedCardId === id ? 0 : 180;
    
    Animated.spring(flipAnimations[id], {
      toValue: currentValue,
      useNativeDriver: true,
    }).start(() => {
      setFlippedCardId(currentValue === 180 ? id : null);
    });
  };

  if (lieux.length === 0) {
    return (
      <Layout 
        activeTab="calendar"
        onMapPress={() => navigation.navigate('Map')}
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

  return (
    <Layout
      activeTab="calendar" 
      onMapPress={() => navigation.navigate('Map')}
      onCalendarPress={() => navigation.navigate('Calendar')}
      onAddPress={() => navigation.navigate('Add')}
      onFavoritePress={() => navigation.navigate('Favorites')}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {lieux.map((lieu) => {
          const frontInterpolate = flipAnimations[lieu.id]?.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
          }) || new Animated.Value(0);

          const backInterpolate = flipAnimations[lieu.id]?.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg'],
          }) || new Animated.Value(0);

          const isFlipped = flippedCardId === lieu.id;

          return (
            <View key={lieu.id} style={styles.cardContainer}>
              {/* Face avant */}
              <Animated.View
                style={[
                  styles.card,
                  { transform: [{ rotateY: frontInterpolate }] },
                  { zIndex: isFlipped ? 0 : 1 },
                ]}
              >
                <View style={styles.cardContent}>
                  <Image
                    source={require('../assets/images/Logo.png')}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <Animated.View>
                    <Text style={styles.title}>{lieu.nom || 'Nom non disponible'}</Text>
                    <Text style={styles.date}>
                      {lieu.date_evenement.debut} - {lieu.date_evenement.fin}
                    </Text>
                  </Animated.View>
                  <TouchableOpacity 
                    style={styles.infoButton} 
                    onPress={() => flipCard(lieu.id)}
                  >
                    <Text style={styles.infoText}>Voir les détails</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              {/* Face arrière */}
              <Animated.View
                style={[
                  styles.card,
                  styles.cardBack,
                  { transform: [{ rotateY: backInterpolate }] },
                  { position: 'absolute', top: 0 },
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
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => flipCard(lieu.id)}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retour</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          );
        })}
      </ScrollView>
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
    paddingBottom: 90,  // Espace en bas pour éviter que la NavBar ne recouvre le contenu
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