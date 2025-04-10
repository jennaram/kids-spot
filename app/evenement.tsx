import { useState, useRef } from 'react';
import { Animated, View } from 'react-native';

const CustomCard = () => {
  const [flipped, setFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    if (flipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 180,
        useNativeDriver: true,
      }).start();
    }
    setFlipped(!flipped);
  };

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
        <Image
          source={require('../assets/images/Logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.infoContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Titre de l'événement</Text>
            <Text style={styles.date}>12 avril 2025</Text>
          </View>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={flipCard}
          >
            <Text style={styles.infoText}>i</Text>
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
        <View style={{ padding: 20 }}>
          <Text style={styles.modalTitle}>Détails de l'événement</Text>
          <Text style={styles.modalText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={flipCard}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retour</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  card: {
    width: '90%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 180,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  infoButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
});

export default CustomCard;