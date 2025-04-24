import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Platform,
    Linking,
    Button,
    StyleSheet,
    SafeAreaView,
    FlatList,
    ScrollView
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import getUserLocation from '@/hooks/localisation';
import fetchNearbyPlaces from '@/api/fetchNearbyPlaces';
import { colorButtonThird } from './style/styles';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/LitleCard/Card';
import MenuBurger from './components/menuburger';


export default function MapScreen() {
    const [userLocation, setUserLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    const [nearbyPlaces, setNearbyPlaces] = useState<any[] | null>(null);

    const [error, setError] = useState<string | null>(null);

    const loadNearbyPlaces = async (lat: number, lng: number) => {
        const placesData = await fetchNearbyPlaces(lat, lng);
        if (placesData && placesData.status === 'success' && placesData.data) {
            setNearbyPlaces(placesData.data);
        } else {
            console.error('Erreur lors de la récupération des lieux à proximité');
            // Vous pouvez éventuellement afficher une erreur à l'utilisateur ici
        }
    };

    const fetchLocationAndPlaces = async () => {
        const location = await getUserLocation();
        if (location) {
            setUserLocation(location);
            setError(null);
            // Une fois la localisation obtenue, chargez les lieux à proximité
            loadNearbyPlaces(location.latitude, location.longitude);
        } else {
            setError('Impossible d\'obtenir la localisation.');
        }
    };

    useEffect(() => {
        fetchLocationAndPlaces();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchLocationAndPlaces();
            return () => { };
        }, [])
    );

    if (error) {
        return (
            <View
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
            >
                <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>
                    {error}
                </Text>
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
            <MenuBurger/>
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