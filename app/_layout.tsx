import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="geolocalisation" options={{ title: 'Localisation' }} />
      <Stack.Screen name="retourGeoloc" options={{ title: 'Votre position' }} />
    </Stack>
  );
}