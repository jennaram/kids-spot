import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

type AuthHeaderProps = {
    logoSize?: number;
    marginBottom?: number;
}

export function AuthHeader({ logoSize = 200, marginBottom = 40 }: AuthHeaderProps) {
    const appLogo = require('../../assets/images/Logo.png');
    
    return (
        <View style={[styles.logoContainer, { marginBottom }]}>
            <Image
                source={appLogo}
                style={[styles.logo, { width: logoSize, height: logoSize }]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        resizeMode: 'contain',
    },
});

export default AuthHeader;