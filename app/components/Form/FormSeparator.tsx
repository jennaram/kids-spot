import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

type FormSeparatorProps = {
    text?: string;
    color?: string;
    marginVertical?: number;
};

export function FormSeparator({ 
    text = "ou", 
    color = '#999', 
    marginVertical = 15 
}: FormSeparatorProps) {
    return (
        <View style={[styles.container, { marginVertical }]}>
            <View style={styles.line} />
            <Text style={[styles.separatorText, { color }]}>{text}</Text>
            <View style={styles.line} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    separatorText: {
        fontSize: 16,
        fontWeight: '500',
        paddingHorizontal: 12,
        textAlign: 'center',
    },
});

export default FormSeparator;