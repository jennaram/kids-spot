import { Stack } from 'expo-router';
import CustomDrawerLayout from './components/_layout_drawer';

export default function RootLayout() {
  // Let Expo Router manage screens based on file structure within the Drawer/Stack
  return (
    <CustomDrawerLayout>
      {/* Stack will automatically handle routes based on files in the app directory */}
      {/* Remove explicit Stack.Screen definitions unless truly necessary for specific configs */}
      <Stack screenOptions={{ headerShown: false }}>
         {/* Example: If you need specific options for a layout route */}
         {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
      </Stack>
    </CustomDrawerLayout>
  );
}
