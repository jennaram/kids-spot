import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      {/* Ce Stack.Screen permet de configurer l'en-tête pour toutes les pages */}
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      
      {/* Le contenu de chaque page sera injecté ici */}
      <View>
        <Stack.Screen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  }
});