import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colorButtonFirst, colorFourth, fontSubtitle } from '../style/styles';

type Props = {
  point: {
    id: number;
    nom: string;
    adresse: string;
    description?: string;
    image?: string;
    type?: string;
    equipements?: string[];
  };
  distance: string | null;
};

export default function LieuxCard({ point, distance }: Props) {
  return (
    <TouchableOpacity style={styles.card}>
      {point.image && (
        <Image
          source={{ uri: point.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{point.nom}</Text>
        <Text style={styles.adresse}>{point.adresse}</Text>
        {point.description && <Text style={styles.description}>{point.description}</Text>}
        {distance && <Text style={styles.distance}>{distance} km</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colorFourth,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorButtonFirst,
  },
  adresse: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  distance: {
    marginTop: 6,
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});
