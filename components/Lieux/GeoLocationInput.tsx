import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colorButtonFirst } from '@/app/style/styles';
import styles from '@/app/style/GeoLocationInput.styles';

type Props = {
  address: string;
  onAddressChange: (text: string) => void;
  onGetLocation: () => void;
};

const GeoLocationInput: React.FC<Props> = ({ address, onAddressChange, onGetLocation }) => (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder="Entrez l'adresse complète"
      value={address}
      onChangeText={onAddressChange}
    />
    <TouchableOpacity onPress={onGetLocation} style={styles.icon}>
      <MaterialIcons name="my-location" size={24} color={colorButtonFirst} />
    </TouchableOpacity>
  </View>
);

export default GeoLocationInput;
