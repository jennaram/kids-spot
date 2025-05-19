// ErrorView.tsx
import React from 'react';
import { View, Text, Button, Platform, Linking } from 'react-native';

interface ErrorViewProps {
    error: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({ error }) => {
    return (
        <View>
            <Text style={{ color: 'red' }}>{error}</Text>
            {Platform.OS === 'android' && error.includes('Google Play services') && (
                <Button
                    title="Vérifier Google Play Services"
                    onPress={() =>
                        Linking.openURL('market://details?id=com.google.android.gms')
                    }
                />
            )}
        </View>
    );
};

export default ErrorView;