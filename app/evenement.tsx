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
import AgeBadges  from '../components/Lieux/AgeBadges';
import LieuActionButtons from '@/components/Lieux/LieuActionButtons';
import { IconesLieux } from '@/components/IconesLieux';
import { Alert, Linking, Platform } from 'react-native';
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
  // Extraire le lieu sélectionné pour la modale
  const currentLieu = lieux.find(lieu => lieu.nom === currentNom);

  

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
  const handleGpsPress = () => {
    if (!currentLieu || !currentLieu.position) return;
  
    const { latitude, longitude } = currentLieu.position;
  
    Alert.alert(
      "Choisissez une application",
      "Quelle application voulez-vous utiliser pour l'itinéraire ?",
      [
        {
          text: "Google Maps",
          onPress: () => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
            Linking.openURL(url);
          }
        },
        {
          text: "Waze",
          onPress: () => {
            const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
            Linking.openURL(url);
          }
        },
        {
          text: "Apple Plans",
          onPress: () => {
            const url = `http://maps.apple.com/?daddr=${latitude},${longitude}`;
            Linking.openURL(url);
          },
          style: Platform.OS === "ios" ? "default" : "cancel",
        },
        {
          text: "Annuler",
          style: "cancel"
        }
      ]
    );
  };

  const handleCall = () => {
    if (!currentLieu || !currentLieu.adresse?.telephone) return;
  
    const phoneNumber = currentLieu.adresse.telephone.replace(/\s/g, '');
  
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const handleWebsite = () => {
    if (!currentLieu || !currentLieu.adresse?.site_web) return;
  
    let url = currentLieu.adresse.site_web.trim();
  
    // Ajoute "https://" si manquant
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
  
    Linking.openURL(url);
  };
  

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
        <View>
          <Text >
            {nearbyPlaces 
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
          <View style={styles.modalBody}>
  <ScrollView style={styles.descriptionScroll}>
    <Text style={styles.fullDescriptionText}>{currentDescription}</Text>
  </ScrollView>

  <View style={styles.modalFooter}>
    {currentLieu && (
      <>
        <IconesLieux equipements={currentLieu.equipements} />
        <AgeBadges tranchesAge={currentLieu.ages.map(age => age.nom)} />
        <LieuActionButtons
          onCall={handleCall}
          onWebsite={handleWebsite}
          onGps={handleGpsPress}
          telephone={currentLieu.adresse?.telephone || null}
          siteWeb={currentLieu.adresse?.site_web || null}
        />
      </>
    )}
  </View>
</View>

        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Evenement;