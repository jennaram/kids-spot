import { Image, Text, View, Button } from "react-native";
import { useRouter } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


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
      <Button title="Accueil" onPress={() => router.push('/accueil')} /> 
      <Button title="Voir la carte" onPress={() => router.push('/main')} />
      <Button title="Evenement" onPress={() => router.push('/evenement')} />
      <Button title="Voir le detail des lieux" onPress={() => router.push('/details_lieu')} />
      <Button title="Ajouter un lieux" onPress={() => router.push('/add-place')} />
      <Button title="Inscription" onPress={() => router.push('/registration')} />
      <Button title="A propos" onPress={() => router.push('/about')} />
      <Button title="Menu burger" onPress={() => router.push('/components/menuburger')} />
      <Button title="Contact" onPress={() => router.push('/contact')} />
      <Button title="Avis" onPress={() => router.push('/avis')} /> 
       
    </View>
  );
}