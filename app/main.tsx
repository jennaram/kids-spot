import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { mockPoints } from './points';
import { useRouter } from 'expo-router';

// 📍 Associe chaque type à une icône
const iconByType = {
  culturel: require('../assets/images/iconfun.png'),
  restaurant: require('../assets/images/iconfood.png'),
  loisirs: require('../assets/images/iconcultural.png'),
};

export default function MapScreen() {
  const [points, setPoints] = useState([]);
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map'); // 🛠️ ça doit être dans le composant

  useEffect(() => {
    setPoints(mockPoints); // simule un fetch de base de données
  }, []);

  return (
    <View style={styles.container}>
      {viewMode === 'map' ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 48.8566,
            longitude: 2.3522,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {points.map((point) => (
            <Marker
              key={point.id}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              title={point.name}
              description={point.description}
            >
              <Image
                source={iconByType[point.type]}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </Marker>
          ))}
        </MapView>
      ) : (
        <ScrollView style={styles.listContainer}>
          {points.map((point) => (
            <View key={point.id} style={styles.item}>
              <Text style={styles.title}>{point.name}</Text>
              <Text>{point.description}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* 👇 Le bouton de switch est en bas de la vue */}
      <View style={styles.buttonContainer}>
      <Button title="Affichier la liste" onPress={() => router.push('/listelieux')} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 10,
  },
  item: {
    marginBottom: 12,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
});
