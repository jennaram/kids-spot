import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';

// Import du composant de layout et styles
import Layout from './components/LayoutNav';
import { eventCardStyles as styles } from './style/EventCardStyles';
import { fontTitle } from './style/styles';
import { ButtonStyle } from './style/styles';
import { colorButtonThird } from './style/styles';
import { Lieu } from './types/lieu';
// Import du composant Card
import EventCard from './components/EventCard';
import MenuBurger from './components/menuburger';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/Navigation';


const Evenement = () => {
  // État pour stocker la liste des lieux
  const [lieux, setLieux] = useState<Lieu[]>([]);
  // État pour gérer quel lieu est actuellement "flippé"
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);
  // État pour gérer la modal de description complète
  const [modalVisible, setModalVisible] = useState(false);
  // État pour stocker la description à afficher dans la modal
  const [currentDescription, setCurrentDescription] = useState('');
  // État pour stocker le nom du lieu de la description
  const [currentNom, setCurrentNom] = useState('');
  
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
      <MenuBurger/>
      <Title text={'Événements'}/>
      
      <ScrollView >
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
      <Navigation></Navigation>
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
            <TouchableOpacity 
              style={[styles.closeButton, ButtonStyle]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: colorButtonThird }}>Fermer</Text>
            </TouchableOpacity>
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