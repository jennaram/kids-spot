// useFadeInOut.ts
import { useState } from 'react';
import { Animated } from 'react-native';

export function useFadeInOut() {
    const [fadeAnim] = useState(new Animated.Value(1));

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const fadeOut = (callback: () => void) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            callback();
            fadeIn();
        });
    };

    return { fadeAnim, fadeIn, fadeOut };
}