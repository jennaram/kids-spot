import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export type EquipmentKeys =
  | 'strollerAccess'
  | 'playArea'
  | 'microwave'
  | 'highChair'
  | 'changingTable'
  | 'parking'
  | 'restaurant';

export type EquipmentType = Record<EquipmentKeys, boolean>;

interface EquipementItem {
  id: number;
  nom: string;
}

interface IconesLieuxProps {
  equipements: EquipementItem[];
}

const equipmentLabels: Record<EquipmentKeys, string> = {
  strollerAccess: 'Accès poussette',
  playArea: 'Aire de jeux',
  microwave: 'Micro-onde',
  highChair: 'Chaise haute',
  changingTable: 'Table à langer',
  parking: 'Parking',
  restaurant: 'Restaurant',
};

const equipmentIcons: Record<EquipmentKeys, string> = {
  strollerAccess: 'stroller',
  playArea: 'sports-soccer',
  microwave: 'microwave',
  highChair: 'chair',
  changingTable: 'baby-changing-station',
  parking: 'local-parking',
  restaurant: 'restaurant',
};

export function IconesLieux({ equipements }: IconesLieuxProps) {
  // Create a mapping of equipment labels to their enabled state
  const enabledEquipments: EquipmentType = {
    strollerAccess: false,
    playArea: false,
    microwave: false,
    highChair: false,
    changingTable: false,
    parking: false,
    restaurant: false,
  };

  // Map received equipements to the enabledEquipments object
  equipements.forEach((equipement) => {
    const equipmentKey = Object.keys(equipmentLabels).find(
      key => equipmentLabels[key as EquipmentKeys] === equipement.nom
    ) as EquipmentKeys | undefined;

    if (equipmentKey) {
      enabledEquipments[equipmentKey] = true;
    }
  });

  return (
    <View style={styles.container}>
      {Object.entries(enabledEquipments)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([key]) => {
          const equipmentKey = key as EquipmentKeys;
          const iconName = equipmentIcons[equipmentKey];

          return (
            <View key={key} style={styles.iconWrapper}>
              <MaterialIcons 
                name={iconName} 
                size={30} 
                color="#333" 
              />
              <Text style={styles.iconText}>{equipmentLabels[equipmentKey]}</Text>
            </View>
          );
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