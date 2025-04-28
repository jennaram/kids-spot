import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Modal, Image } from 'react-native';
import { router } from 'expo-router';

// Définition des types pour les props
interface PlacePopUpProps {
  visible: boolean;
  onClose: () => void;
  place: any;  // Le lieu sélectionné
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  iconByType: {
    [key: string]: any;
  };
}

const PlacePopUp: React.FC<PlacePopUpProps> = ({ 
  visible, 
  onClose, 
  place, 
  userLocation,
  iconByType
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { height } = Dimensions.get('window');

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(0);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const navigateToDetails = (place: { id: string }) => {
    onClose();
    setTimeout(() => {
      router.push({
        pathname: '/details_lieu',
        params: { id: place.id }
      });
    }, 300);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Rayon de la terre en km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance en km
    return distance.toFixed(1); // Arrondi à une décimale
  };
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  const getIconBackgroundStyle = (typeName: string) => {
    switch(typeName) {
      case 'Culture':
        return styles.cultureBackground;
      case 'Restaurant':
        return styles.restaurantBackground;
      case 'Loisir':
        return styles.loisirBackground;
      default:
        return {};
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  if (!place || !userLocation) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY }] }
          ]}
        >
          <View style={styles.handle} />
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <View style={[
                styles.iconContainer,
                getIconBackgroundStyle(place.type[0].nom)
              ]}>
                <Image
                  source={iconByType[place.type[0].nom]}
                  style={styles.popupIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.popupTitle}>{place.nom}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>{place.adresse.ville}</Text>
              <Text style={styles.infoText}>
                {userLocation ? calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  place.position.latitude,
                  place.position.longitude
                ) : '?'} km
              </Text>
              <Text style={styles.infoText}>{place.horaires}</Text>
            </View>

            <TouchableOpacity 
              style={styles.detailsButton} 
              onPress={() => navigateToDetails(place)}
            >
              <Text style={styles.detailsButtonText}>Voir plus de détails</Text>
              <Text style={styles.arrowRight}>→</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 16,
    maxHeight: '40%',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 16,
    alignSelf: 'center',
  },
  content: {
    paddingVertical: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  popupIcon: {
    width: 24,
    height: 24,
  },
  cultureBackground: {
    backgroundColor: '#ff9770',
  },
  restaurantBackground: {
    backgroundColor: '#95d5b2',
  },
  loisirBackground: {
    backgroundColor: '#8ecae6',
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  detailsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailsButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
  arrowRight: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
  }
});

export default PlacePopUp;