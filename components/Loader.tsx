import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Logo } from './Logo';


export default function Loader() {
  return (
    <View style={styles.container}>
      <Logo></Logo>
      <ActivityIndicator size="large" color="#3498db" />
      <Text style={styles.text}>Chargement...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // ou ton background principal
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});