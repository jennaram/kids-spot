import { useRouter } from 'expo-router';
import { Button, View, Text } from 'react-native';
import * as Location from 'expo-location';

export default function Geolocalisation() {
  const router = useRouter();

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission refusée');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    router.push({
      pathname: '/retourGeoloc',
      params: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        alt: location.coords.altitude || 0
      }
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Obtenir ma position" onPress={handleGetLocation} />
    </View>
  );
}