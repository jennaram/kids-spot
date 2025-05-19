// Hook personnalisé pour gérer des animations de fondu (fade in / fade out)

import { useState } from 'react';
import { Animated } from 'react-native';

export function useFadeInOut() {
    // Initialise une valeur d'animation à 1 (complètement visible)
    const [fadeAnim] = useState(new Animated.Value(1));

    // Fonction pour effectuer un fondu entrant (apparition)
    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1, // Opacité finale : complètement visible
            duration: 300, // Durée de l'animation en ms
            useNativeDriver: true, // Utilise le moteur natif pour de meilleures performances
        }).start();
    };

    // Fonction pour effectuer un fondu sortant (disparition) puis callback
    const fadeOut = (callback: () => void) => {
        Animated.timing(fadeAnim, {
            toValue: 0, // Opacité finale : complètement invisible
            duration: 300, // Durée de l'animation en ms
            useNativeDriver: true, // Utilise le moteur natif
        }).start(() => {
            callback(); // Exécute la fonction une fois l'animation terminée
            fadeIn();   // Relance automatiquement un fade in pour réafficher
        });
    };

    // Le hook retourne la valeur d'animation et les deux fonctions
    return { fadeAnim, fadeIn, fadeOut };
}