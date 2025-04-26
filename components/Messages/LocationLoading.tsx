import React from 'react';
import { View, Text } from 'react-native';

const LoadingView: React.FC = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Chargement de votre position...</Text>
        </View>
    );
};

export default LoadingView;