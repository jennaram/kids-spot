import React from 'react';
import { Text, StyleSheet } from 'react-native';

const FormSeparator: React.FC = () => (
  <Text style={styles.separator}>ou</Text>
);

const styles = StyleSheet.create({
  separator: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 15,
    fontSize: 16,
  },
});

export default FormSeparator;