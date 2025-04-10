import { Image, Text, View, Button } from "react-native";
import { useRouter } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Geolocalisation from './geolocalisation';
import RetourGeoloc from './retourGeoloc';

const Stack = createNativeStackNavigator();

export default function Index() {
  const router = useRouter();
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../assets/images/Logo.png')}
        style={{ width: 200, height: 200, resizeMode: 'contain', marginBottom: 20 }}
      />
      <Text>Bienvenue sur Kids Spot </Text>
      <Button title="Voir la carte" onPress={() => router.push('/main')} />
        <Button title="Position" onPress={() => router.push('/geolocalisation')} />
    </View>

  );
}
