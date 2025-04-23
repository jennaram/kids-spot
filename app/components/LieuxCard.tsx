// components/LieuCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { fontSubtitle } from '../style/styles';
import { colorButtonFirst } from '../style/styles';

interface Props {
  point: {
    id: string;
    nom: string;
    description: string;
    horaires?: string;
    image?: any;
    position: {
      latitude: number;
      longitude: number;
    };
  };
  distance?: string | null;
}

const LieuCard: React.FC<Props> = ({ point, distance }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        router.push({ pathname: '/details_lieu', params: { id: point.id, nom: point.nom } })
      }
    >
      <View style={styles.itemContent}>
        {point.image && <Image source={point.image} style={styles.image} />}
        <View style={styles.textContainer}>
          <Text style={[fontSubtitle]}>{point.nom}</Text>
          <Text style={styles.description}>{point.description}</Text>
          {point.horaires && <Text style={styles.info}>Horaires : {point.horaires}</Text>}
        </View>
        {distance && <Text style={styles.distance}>{distance} km</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  distance: {
    marginLeft: 8,
    fontWeight: '600',
    color: colorButtonFirst,
  },
});

export default LieuCard;
