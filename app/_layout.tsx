import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { LocationProvider } from '@/context/locate/LocationContext';
import { AuthProvider } from '@/context/auth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <LocationProvider>
        <View style={styles.container}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <View>
            <Stack.Screen />
          </View>
        </View>
      </LocationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});