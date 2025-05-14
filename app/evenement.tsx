import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated, SafeAreaView, ScrollView, Modal } from 'react-native';
import { eventCardStyles as styles } from './style/EventCardStyles';
import { fontTitle } from './style/styles';
import EventCard from './components/EventCard';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/NavBar/Navigation';
import { ExitButton } from './components/ExitButton';
import { useLocation } from '@/context/locate';
import { Place } from '@/types/place';

const Evenement = () => {
  // Récupérer la liste des lieux à partir du contexte
  const { nearbyPlaces, error, refreshLocation } = useLocation();
  // État pour stocker la liste des lieux filtrés pour les événements
  const [lieux, setLieux] = useState<Place[]>([]);
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

  // Fonction pour vérifier si un événement est encore valide (non expiré)
  const isEventValid = (event: Place): boolean => {
    if (!event.est_evenement || !event.date_evenement?.fin) return false;
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Conversion de la date de fin (format YYYY-MM-DD)
      const endDate = new Date(event.date_evenement.fin);
      endDate.setHours(23, 59, 59, 999); // Fin de la journée
      
      return endDate >= today;
    } catch (error) {
      console.error("Erreur de traitement de date:", error);
      return false;
    }
  };

  useEffect(() => {
    if (nearbyPlaces) {
      console.log('Nombre de lieux reçus:', nearbyPlaces.length);
      
      // Filtrer pour ne garder que les événements valides
      const validEvents = nearbyPlaces.filter(isEventValid);

      console.log('Événements valides trouvés:', validEvents.length);

      // Initialiser les animations pour chaque événement
      validEvents.forEach((event) => {
        if (!flipAnimations[event.id]) {
          flipAnimations[event.id] = new Animated.Value(0);
        } else {
          flipAnimations[event.id].setValue(0);
        }
      });

      setLieux(validEvents);
    }
  }, [nearbyPlaces]);

  const flipCard = (id: number) => {
    if (flippedCardId !== null && flippedCardId !== id) {
      Animated.timing(flipAnimations[flippedCardId], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(flipAnimations[id], {
          toValue: 180,
          duration: 200,
          useNativeDriver: true,
        }).start();
        setFlippedCardId(id);
      });
    } else if (flippedCardId === id) {
      Animated.timing(flipAnimations[id], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setFlippedCardId(null);
      });
    } else {
      Animated.timing(flipAnimations[id], {
        toValue: 180,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setFlippedCardId(id);
      });
    }
  };

  const openFullDescription = (description: string, nom: string) => {
    setCurrentDescription(description);
    setCurrentNom(nom);
    setModalVisible(true);
  };

  if (lieux.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <BurgerMenu />
        <Title text={'Événements'} />
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsText}>
            {nearbyPlaces?.length > 0 
              ? "Aucun événement à venir actuellement" 
              : "Chargement des événements..."}
          </Text>
        </View>
        <Navigation />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BurgerMenu />
      <Title text={'Événements'} />

      <ScrollView style={styles.scrollView}>
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