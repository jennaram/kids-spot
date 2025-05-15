import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { eventCardStyles as styles } from '../style/EventCardStyles';
import { fontSubtitle } from '../style/styles';
import { ButtonStyle } from '../style/styles';
import { Place } from '@/types/place';
import { IMAGE_BASE_URL } from '@/api/apiConfig';
// Interface pour les propriétés du composant EventCard
interface EventCardProps {
  lieu: Place;
  onOpenFullDescription: (description: string, nom: string) => void;
  flipAnimations: { [key: number]: Animated.Value };
  flippedCardId: number | null;
  onFlipCard: (id: number) => void;
}

// Interface Lieu importée du fichier principal (ou vous pouvez la déplacer ici)

const EventCard: React.FC<EventCardProps> = ({
  lieu,
  onOpenFullDescription,
  flipAnimations,
  flippedCardId,
  onFlipCard
}) => {
  const frontInterpolate = flipAnimations[lieu.id]?.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  }) || new Animated.Value(0);

  const backInterpolate = flipAnimations[lieu.id]?.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  }) || new Animated.Value(0);

  const isFlipped = flippedCardId === lieu.id;

  const imageUrl = `${IMAGE_BASE_URL}${lieu.id}.jpg`; 
  const [ imageError, setImageError ] = useState(false);
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
            source={
              imageError
                ? require('@/assets/images/Logo.png') // Utilise le logo comme image par défaut
                : { uri: imageUrl }
            }
            style={styles.image}
            onError={() => setImageError(true)}
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
              onPress={() => onFlipCard(lieu.id)}
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
          {/* <Text style={styles.modalText}>
            Équipements : {lieu.equipements?.map(equipement => equipement.nom).join(', ') || 'Non spécifiés'}
          </Text> */}
          <Text style={styles.modalText}>
            Tranche d'âge : {lieu.ages?.map(age => age.nom).join(', ') || 'Non spécifiée'}
          </Text>

          {/* Description avec "Lire plus..." */}
          <View style={styles.descriptionContainer}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.modalText}
            >
              {lieu.description}
            </Text>

            {lieu.description && lieu.description.length > 100 && (
              <TouchableOpacity
                onPress={() => onOpenFullDescription(lieu.description, lieu.nom)}
                style={styles.readMoreButton}
              >
                <Text style={styles.readMoreText}>Lire plus...</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.boutonRetour, ButtonStyle]}
            onPress={() => onFlipCard(lieu.id)}
          >
            <Text style={{ color: '#FFFFFF' }}>Retour</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default EventCard;