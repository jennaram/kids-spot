import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Geolocalisation from './geolocalisation';
import RetourGeoloc from './retourGeoloc';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Geolocalisation" component={Geolocalisation} />
      <Stack.Screen name="RetourGeoloc" component={RetourGeoloc} />
    </Stack.Navigator>
  );
}