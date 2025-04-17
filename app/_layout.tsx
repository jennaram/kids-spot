import { Stack } from 'expo-router';
// import CustomDrawerLayout from './components/_layout_drawer'; // Temporairement commenté

export default function RootLayout() {
  // Layout simplifié pour tester le bouton Retour
  return (
    // <CustomDrawerLayout> // Temporairement commenté
      <Stack>
        {/* Gardez vos écrans ici, adaptez si nécessaire */}
        {/* Exemple, vous devrez peut-être lister explicitement les écrans 
             qui étaient sous (main), (add-place), etc. si la structure change */}
        <Stack.Screen name="index" options={{ headerShown: false }} /> 
        <Stack.Screen name="accueil" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="registration" options={{ headerShown: false }} />
        <Stack.Screen name="main" options={{ headerShown: false }} /> 
        <Stack.Screen name="listelieux" options={{ headerShown: false }} />
        <Stack.Screen name="details_lieu" options={{ headerShown: false }} /> 
        <Stack.Screen name="add-place" options={{ headerShown: false }} />
        {/* Ajoutez d'autres écrans si nécessaire... */}
        {/* <Stack.Screen name="(main)" options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="calendar" options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="(add-place)" options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="favorites" options={{ headerShown: false }} /> */}
      </Stack>
    // </CustomDrawerLayout> // Temporairement commenté
  );
}