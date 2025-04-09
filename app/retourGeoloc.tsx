import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function RetourGeoloc() {
  const { lat, lng, alt } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre position</Text>
      <Text>Latitude: {lat}</Text>
      <Text>Longitude: {lng}</Text>
      <Text>Altitude: {alt} m</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 }
});