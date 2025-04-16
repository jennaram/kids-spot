import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
      <Stack.Screen name="calendar" options={{ headerShown: false }} />
      <Stack.Screen name="(add-place)" options={{ headerShown: false }} />
      <Stack.Screen name="favorites" options={{ headerShown: false }} />
    </Stack>
  );
}