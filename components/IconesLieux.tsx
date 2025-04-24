import React from "react";
import { View, StyleSheet } from "react-native";
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
    <View style={styles.iconsContainer}>
      {equipements.map((equipement, index) => {
        const iconName = iconMapping[equipement.nom];
        
        return iconName ? (
          <MaterialIcons 
            key={index} 
            name={iconName} 
            size={30} 
            color="#333" 
          />
        ) : null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
  }
});