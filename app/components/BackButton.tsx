import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';

type BackButtonProps = {
    /**
     * Destination de navigation (optionnelle )
     * Par défaut: retour à l'écran précédent
     */
    navigateTo?: string;
    /**
     * Fonction personnalisée à exécuter (optionnelle)
     * Si fournie, override la navigation par défaut
     */
    onPress?: () => void;
    /**
     * Style personnalisé pour le conteneur
     */
    style?: object;
    /**
     * Style personnalisé pour l'image
     */
    imageStyle?: object;
}

export function BackButton({ navigateTo, onPress, style, imageStyle }: BackButtonProps) {
    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (navigateTo) {
            router.replace(navigateTo);
        } else {
            router.replace('.');
        }
    };

    return (
        <TouchableOpacity
            style={[styles.backButton, style]}
            onPress={handlePress}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
            <Image
                source={require('../../assets/images/fleche_retour.png')}
                style={[styles.backButtonImage, imageStyle]}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backButton: {
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    backButtonImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
});

export default BackButton;