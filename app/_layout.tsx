import { Stack } from 'expo-router';
import CustomDrawerLayout from './components/_layout_drawer';

export default function RootLayout() {
  // Le CustomDrawerLayout va gérer le burger menu
  // tandis que Stack gère la navigation entre écrans
  return (
    <CustomDrawerLayout>
      <Stack>
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="calendar" options={{ headerShown: false }} />
        <Stack.Screen name="(add-place)" options={{ headerShown: false }} />
        <Stack.Screen name="favorites" options={{ headerShown: false }} />
      </Stack>
    </CustomDrawerLayout>
  );
}