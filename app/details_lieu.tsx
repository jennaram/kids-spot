import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const DetailsLieu = ({ route, navigation }) => {
  // Vous pouvez passer les données du lieu via route.params depuis la carte
  // Pour l'exemple, je vais utiliser des données statiques comme sur l'image
  const lieu = {
    nom: "Parc Montsouris - Paris 14",
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    horaires: "Tous les jours de 11h à 23h",
    note: "5/5",
    avis: "205 avis membres",
    tranchesAge: ["0-2 ans", "3-6 ans", "7 ans +"]
  };

  return (
    <View style={styles.container}>
      {/* En-tête avec nom et note */}
      <View style={styles.header}>
        <Text style={styles.note}>{lieu.note}</Text>
        <Text style={styles.avis}>{lieu.avis}</Text>
        <Text style={styles.nom}>{lieu.nom}</Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.description}>{lieu.description}</Text>
      </View>

      {/* Horaires */}
      <View style={styles.section}>
        <Text style={styles.horaires}>{lieu.horaires}</Text>
      </View>

      {/* Tranches d'âge */}
      <View style={styles.ageContainer}>
        {lieu.tranchesAge.map((age, index) => (
          <View key={index} style={styles.ageBadge}>
            <Text style={styles.ageText}>{age}</Text>
          </View>
        ))}
      </View>

      {/* Boutons d'action */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.button, styles.avisButton]}>
          <Text style={styles.buttonText}>Donner mon avis</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.voirAvisButton]}>
          <Text style={styles.buttonText}>Voir les avis</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.yAllerButton]}>
          <Text style={styles.buttonText}>Y aller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    marginBottom: 20,
  },
  nom: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  note: {
    fontSize: 18,
    color: '#FFD700', // Or pour la note
    fontWeight: 'bold',
  },
  avis: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  horaires: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  ageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  ageBadge: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  ageText: {
    fontSize: 14,
  },
  actionsContainer: {
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  avisButton: {
    backgroundColor: '#f0f0f0',
  },
  voirAvisButton: {
    backgroundColor: '#e0e0e0',
  },
  yAllerButton: {
    backgroundColor: '#FFA500', // Orange comme Burger King
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailsLieu;
