import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '@/app/style//available-equipments.styles';

export type EquipmentKeys = 'strollerAccess' | 'playArea' | 'microwave' | 'highChair' | 'changingTable';
export type EquipmentType = Record<EquipmentKeys, boolean>;

type Props = {
  equipments: EquipmentType;
  toggleEquipment: (key: EquipmentKeys) => void;
};

const equipmentLabels: Record<EquipmentKeys, string> = {
  strollerAccess: 'Accès poussette',
  playArea: 'Aire de jeux',
  microwave: 'Micro-onde',
  highChair: 'Chaise haute',
  changingTable: 'Table à langer',
};

export const AvailableEquipments: React.FC<Props> = ({ equipments, toggleEquipment }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Équipements disponibles</Text>
      {Object.entries(equipments).map(([key, value]) => (
        <TouchableOpacity
          key={key}
          style={styles.checkbox}
          onPress={() => toggleEquipment(key as EquipmentKeys)}
        >
          <View style={[styles.checkboxBox, value && styles.checkboxSelected]}>
            {value && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            {equipmentLabels[key as EquipmentKeys]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
