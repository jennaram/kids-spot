import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { mockPoints } from './points';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function ListeLieux() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {mockPoints.map((point) => (
          <TouchableOpacity key={point.id} style={styles.item}>
            <Text style={styles.title}>{point.name}</Text>
            <Text style={styles.description}>{point.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Text style={styles.link} onPress={() => navigation.goBack()}>
          ← Retour à la carte
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  item: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 10,
  },
  link: {
    color: '#007bff',
    fontSize: 16,
  },
});
