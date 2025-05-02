import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '@/app/style/available-equipments.styles';

export type EquipmentKeys =
  | 'strollerAccess'
  | 'playArea'
  | 'microwave'
  | 'highChair'
  | 'changingTable'
  | 'parking';

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
  parking: 'Parking',
};

const equipmentIcons: Record<EquipmentKeys, string> = {
  strollerAccess: 'stroller',
  playArea: 'sports-soccer',
  microwave: 'microwave',
  highChair: 'chair',
  changingTable: 'baby-changing-station',
  parking: 'local-parking',
};

export const AvailableEquipments: React.FC<Props> = ({ equipments, toggleEquipment }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Équipements disponibles</Text>
      {Object.entries(equipments).map(([key, value]) => {
        const equipmentKey = key as EquipmentKeys;
        const iconName = equipmentIcons[equipmentKey];

        return (
          <TouchableOpacity
            key={key}
            style={styles.checkbox}
            onPress={() => toggleEquipment(equipmentKey)}
          >
            <View style={[styles.checkboxBox, value && styles.checkboxSelected]}>
              {value && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <MaterialIcons
              name={iconName}
              size={24}
              color={value ? '#000' : '#aaa'}
              style={styles.icon}
            />
            <Text style={styles.checkboxLabel}>
              {equipmentLabels[equipmentKey]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};