import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface EquipementItem {
  id: number;
  nom: string;
}

interface IconesLieuxProps {
  equipements: EquipementItem[];
}

export function IconesLieux({ equipements }: IconesLieuxProps) {  
  const iconMapping: Record<string, string> = {
    "Aire de jeux": "sports-soccer",
    "Accès poussette": "stroller",
    "Micro-ondes": "microwave",
    "Espace bébé": "baby-changing-station",
    "Restaurant": "restaurant",
    "Restauration": "restaurant",
    // "Toilettes": "wc",
    // "Wifi": "wifi",
    // "Parking": "local-parking",
    // "Aire de jeux": "toys",
    // "Aire de pique-nique": "outdoor-grill"
  };

  return (
    <View style={styles.container}>
      {equipements.map((equipement, index) => {
        const iconName = iconMapping[equipement.nom];
        
        return iconName ? (
          <View key={index} style={styles.iconWrapper}>
            <MaterialIcons 
              name={iconName} 
              size={30} 
              color="#333" 
            />
            <Text style={styles.iconText}>{equipement.nom}</Text>
          </View>
        ) : null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
  },
  iconWrapper: {
    alignItems: "center",
    padding: 8,
    minWidth: 80,
  },
  iconText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  }
});