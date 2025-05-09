import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Modal, Image } from 'react-native';
import { router } from 'expo-router';
import styles from '@/app/style/PlacePopUp.style';
import { Row } from '../Row';

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
      case 'Loisirs':
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
              <Text style={styles.popupTitle}>{place.nom}</Text>
              
              {/* L'icône est maintenant positionnée à droite grâce au style */}
              <View style={[
                styles.popupIcon,
                getIconBackgroundStyle(place.type[0].nom)
              ]}>
                <Image
                  source={iconByType[place.type[0].nom]}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              </View>
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

export default PlacePopUp;