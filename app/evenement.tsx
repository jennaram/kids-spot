import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated, SafeAreaView, ScrollView, Modal } from 'react-native';

// Import du composant de layout et styles
import { eventCardStyles as styles } from './style/EventCardStyles';
import { fontTitle } from './style/styles';
// Import du composant Card
import EventCard from './components/EventCard';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/NavBar/Navigation';
import { ExitButton } from './components/ExitButton';
import { useLocation } from '@/context/locate'; // Import du contexte
import { Location } from '@/types/location';

const Evenement = () => {
  // Récupérer la liste des lieux à partir du contexte
  const { nearbyPlaces, error, refreshLocation } = useLocation();
  // État pour stocker la liste des lieux filtrés pour les événements
  const [lieux, setLieux] = useState<Location[]>([]);
  // État pour gérer quel lieu est actuellement "flippé"
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);
  // État pour gérer la modal de description complète
  const [modalVisible, setModalVisible] = useState(false);
  // État pour stocker la description à afficher dans la modal
  const [currentDescription, setCurrentDescription] = useState('');
  // État pour stocker le nom du lieu de la description
  const [currentNom, setCurrentNom] = useState('');

  // Référence pour les animations
  const flipAnimations = useRef<{ [key: number]: Animated.Value }>({}).current;



  useEffect(() => {
    if (nearbyPlaces) {
      // Filtrer pour ne garder que les événements
      const events = nearbyPlaces.filter((l) => l.est_evenement);

      // Initialiser les animations pour chaque événement
      events.forEach((event) => {
        if (!flipAnimations[event.id]) {
          flipAnimations[event.id] = new Animated.Value(0);
        } else {
          flipAnimations[event.id].setValue(0); // Réinitialise la valeur d'animation
        }
      });

      setLieux(events);
    }
  }, [nearbyPlaces]); // Dépendance à nearbyPlaces

  const flipCard = (id: number) => {
    if (flippedCardId !== null && flippedCardId !== id) {
      // Retourne la carte actuellement affichée en arrière
      Animated.timing(flipAnimations[flippedCardId], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Ensuite, retourne la nouvelle carte sélectionnée
        Animated.timing(flipAnimations[id], {
          toValue: 180,
          duration: 200,
          useNativeDriver: true,
        }).start();
        setFlippedCardId(id);
      });
    } else if (flippedCardId === id) {
      // Retourne la carte si elle est déjà visible (toggle off)
      Animated.timing(flipAnimations[id], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setFlippedCardId(null);
      });
    } else {
      // Première ouverture d'une carte
      Animated.timing(flipAnimations[id], {
        toValue: 180,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setFlippedCardId(id);
      });
    }
  };

  // Fonction pour ouvrir la modal avec la description complète
  const openFullDescription = (description: string, nom: string) => {
    setCurrentDescription(description);
    setCurrentNom(nom);
    setModalVisible(true);
  };

  if (lieux.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BurgerMenu />
      <Title text={'Événements'} />

      <ScrollView>
        {lieux.map((lieu) => (
          <EventCard
            key={lieu.id}
            lieu={lieu}
            onOpenFullDescription={openFullDescription}
            flipAnimations={flipAnimations}
            flippedCardId={flippedCardId}
            onFlipCard={flipCard}
          />
        ))}
      </ScrollView>

      {/* Barre de nav */}
      <Navigation />

      {/* Modal pour la description complète */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={[fontTitle, styles.modalHeaderTitle]}>{currentNom}</Text>
            <ExitButton onPress={() => setModalVisible(false)} style={styles.exitButtonCustom} />
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.fullDescriptionText}>{currentDescription}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Evenement;