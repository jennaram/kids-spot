import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Image, 
  View, 
  ActivityIndicator,
  GestureResponderEvent 
} from 'react-native';

type GoogleAuthButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  loading?: boolean;
  disabled?: boolean;
};

export function GoogleAuthButton({ 
  onPress, 
  loading = false, 
  disabled = false
}: GoogleAuthButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        (disabled || loading) && styles.disabled
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      accessibilityLabel="Continuer avec Google"
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator size="small" color="#757575" />
        ) : (
          <>
            <Image
              source={require('../../../assets/images/google-logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
            <Text style={styles.buttonText}>Continuer avec Google</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 10
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 12
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3C4043'
  },
  disabled: {
    opacity: 0.6
  }
});