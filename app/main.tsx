import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect, useRouter } from 'expo-router';

const iconByType = {
  user: require('../assets/images/user-location.png'),
};

export default function MapScreen() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (err) {
      setError('Erreur de géolocalisation');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      startLocationTracking();
      return () => {};
    }, [])
  );

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={userLocation ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        } : undefined}
        showsUserLocation={false}
      >
        {userLocation && (
          <Marker coordinate={userLocation}>
            <Image
              source={iconByType.user}
              style={{ width: 40, height: 40 }}
            />
          </Marker>
        )}
      </MapView>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          backgroundColor: '#FF6B6B',
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        }}
        onPress={() => router.push('/add-place')}
      >
        <Text style={{ color: 'white', fontSize: 30, marginBottom: 3 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}