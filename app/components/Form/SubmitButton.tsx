import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colorButtonFirst } from '../../style/styles';

interface SubmitButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ title, onPress, loading = false }) => (
  <TouchableOpacity
    style={[styles.submitButton, loading && styles.disabledButton]}
    onPress={onPress}
    disabled={loading}
  >
    <Text style={styles.submitButtonText}>
      {loading ? 'En cours...' : title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  submitButton: {
    height: 50,
    backgroundColor: colorButtonFirst,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default SubmitButton;