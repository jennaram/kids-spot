import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Platform,
    Linking,
    Button,
    StyleSheet,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { colorButtonThird } from './style/styles';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/LitleCard/Card';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { useLocation } from '@/context';


export default function MapScreen() {
    const { userLocation, nearbyPlaces, error, refreshLocation } = useLocation();
    if (error) {
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
    }

    if (!userLocation) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Chargement de votre position...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <BurgerMenu/>
            <Title text={'Liste des lieux à proximité'}></Title>
           
            {nearbyPlaces && nearbyPlaces.length > 0 ? (
                <ScrollView>
                    {nearbyPlaces.map((item) => (
                        <Card key={item.id.toString()} place={item} />
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text>Aucun lieu trouvé à proximité.</Text>
                </View>
            )}
             <Navigation></Navigation>

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colorButtonThird,
    },
    listItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    placeName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});