import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { colorButtonThird } from '../../style/styles';

type GoogleAuthButtonProps = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function GoogleAuthButton({
  onPress,
  loading = false,
  disabled = false,
}: GoogleAuthButtonProps) {
  return (
    <View style={styles.googleButtonWrapper}>
      <TouchableOpacity
        style={[
          styles.googleButton,
          disabled && styles.disabledButton,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <View style={styles.googleButtonContent}>
          <Image
            source={require('../../../assets/images/google-logo.png')}
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonText}>
            {loading ? 'Connexion...' : 'Continuer avec Google'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  googleButtonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  googleButton: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    backgroundColor: colorButtonThird,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    justifyContent: 'center',
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
});

export default GoogleAuthButton;