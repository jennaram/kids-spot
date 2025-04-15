import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import { useEffect } from 'react';


interface Lieu {
  nom: string;
  type: string;
  est_evenement: boolean;
  adresse?: {
    adresse?: string;
    code_postal?: string;
    ville?: string;
  };
  equipements?: string[];
}

const CustomCard = () => {
  const [lieu, setLieu] = useState<Lieu | null>(null);
  const [flipped, setFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://seb-prod.alwaysdata.net/kidsspot/lieux/autour/12/12');
        const data = await response.json();
        console.log('Données reçues :', data); 
        // Récupère le premier lieu qui est un événement
        const event = data.lieux.find((l: Lieu) => l.est_evenement);
        setLieu(event || null);
      } catch (error) {
        console.error('Erreur de récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    Animated.spring(flipAnimation, {
      toValue: flipped ? 0 : 180,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  if (!lieu) {
    return (
      <View style={styles.centered}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      {/* Face avant */}
      <Animated.View
        style={[
          styles.card,
          { transform: [{ rotateY: frontInterpolate }] },
          { zIndex: flipped ? 0 : 1 },
        ]}
      >
        <View style={styles.cardContent}>
        <Image
          source={require('../assets/images/Logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
          <Text style={styles.title}>{lieu.nom}</Text>
          <Text style={styles.date}>{lieu.type}</Text>
          <TouchableOpacity style={styles.infoButton} onPress={flipCard}>
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
          <Text style={styles.modalText}>Type : {lieu.type}</Text>
          <Text style={styles.modalText}>
            Équipements : {lieu.equipements?.join(', ') || 'Non spécifiés'}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={flipCard}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retour</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>

  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  card: {
    width: '90%',
    height: 250,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#f8f9fa',
  },
  cardContent: {
    padding: 20,
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
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginTop: 10,
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
    marginTop: 10,
    alignSelf: 'flex-end',
  },
});

export default CustomCard;