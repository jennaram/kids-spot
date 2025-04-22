// Importation des composants et hooks nécessaires
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, SafeAreaView, ScrollView, StatusBar, Dimensions } from 'react-native';
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
import { colorButtonFirst, colorButtonSecondary, colorButtonThird, colorFourth } from './style/styles';
import { fontTitle } from './style/styles';
import { loadFonts } from './style/styles';
import { fontSubtitle } from './style/styles';
import { ButtonStyle } from './style/styles';
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
  description: string;
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

// Obtenir la largeur de l'écran pour calculer les dimensions
const { width } = Dimensions.get('window');
const cardWidth = width * 0.92; // La carte prend 92% de la largeur de l'écran

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
      {/* Barre de titre verte au niveau de l'encoche */}
      <SafeAreaView style={styles.headerBar}>
        <Text style={[fontTitle]}>Événements</Text>
      </SafeAreaView>
      
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
                    source={require('../assets/images/parc_montsouris.jpg')}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.infoContainer}>
                    <View style={styles.textContainer}>
                      <Text style={[fontSubtitle]}>{lieu.adresse?.ville || 'Ville non disponible'}, France</Text>
                      <Text style={styles.subtitle2}>{lieu.nom || 'Nom non disponible'}</Text>
                      <Text style={styles.date}>
                        {lieu.date_evenement.debut} - {lieu.date_evenement.fin}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={[styles.infoButton, ButtonStyle]} 
                      onPress={() => flipCard(lieu.id)}
                    >
                      <Text style={styles.infoText}>Infos</Text>
                    </TouchableOpacity>
                  </View>
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
                  <Text style={[fontSubtitle, styles.modalTitle]}>{lieu.nom}</Text>
                  <Text style={styles.modalText}>
                    {lieu.adresse?.adresse}, {lieu.adresse?.code_postal} {lieu.adresse?.ville}
                  </Text>
                  <Text style={styles.modalText}>Type : {lieu.type.map(t => t.nom).join(', ')}</Text>
                  <Text style={styles.modalText}>
                    Équipements : {lieu.equipements?.join(', ') || 'Non spécifiés'}
                  </Text>
                  <Text style={styles.modalText}>{lieu.description}</Text>
                  <TouchableOpacity 
                    style={[styles.boutonRetour, ButtonStyle]} 
                    onPress={() => flipCard(lieu.id)}
                  >
                    <Text style={[{ color: '#FFFFFF' }]}>Retour</Text>
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
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingVertical: 20,
    paddingBottom: 90, // Espace pour la barre de navigation
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  card: {
    width: cardWidth,
    height: cardWidth * 0.8, // Aspect ratio plus proche du style Airbnb
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#f8f9fa',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '65%', // L'image prend 65% de la hauteur de la carte
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Aligne les éléments en bas
    padding: 16,
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
  },
  location: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  subtitle2: {
    fontSize: 16,
    color: '#222',
    marginBottom: 3,
    marginTop: 3,
  },
  date: {
    fontSize: 14,
    color: '#717171',
  },
  infoButton: {
    backgroundColor: colorButtonFirst,
    alignSelf: 'flex-end',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '100',
    margin: 20,
  },
  modalText: {
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    lineHeight: 22,
  },
  boutonRetour: {
    alignSelf: 'flex-end',
    backgroundColor: colorButtonFirst,
    marginTop: 55,
    marginEnd: 20,
  },
});

export default CustomCard;