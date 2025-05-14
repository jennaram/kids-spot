import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Animated, View, StyleSheet, Text } from 'react-native';
import { colorButtonThird } from './style/styles';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/NavBar/Navigation';
import { Card } from '@/components/LitleCard/Card';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { useLocation } from '@/context/locate';
import FiltreButtons from '@/components/Filtres/FiltreButtons';
import { useFadeInOut } from '@/hooks/Animation';
import { Row } from '@/components/Row';
import LoadingView from '@/components/Messages/LocationLoading';
import SearchBar from '@/components/Filtres/SearchBar';
import ErrorScreen from '@/components/ErrorScreen';
import { Place } from '@/Types/place';
import SwitchMapButton from '@/components/SwitchMapButton';

export default function NearbyPlacesScreen() {
    const { userLocation, nearbyPlaces, error } = useLocation();
    const [selectedTypeIds, setSelectedTypeIds] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { fadeAnim, fadeOut } = useFadeInOut();

    const handleFilterPress = (typeId: number) => {
        fadeOut(() => {
            setSelectedTypeIds(prev => {
                if (prev.includes(typeId)) {
                    return prev.filter(id => id !== typeId);
                } else {
                    return [...prev, typeId];
                }
            });
        });
    };

    const filteredPlaces = (nearbyPlaces ?? []).filter((place: Place) => {
        // Exclure les lieux qui sont des événements
        if (place.est_evenement) return false;
        
        const matchType = selectedTypeIds.length > 0 
            ? place.type?.some(t => selectedTypeIds.includes(t.id)) 
            : true;
        const matchSearch = place.nom.toLowerCase().includes(searchQuery.toLowerCase());
        return matchType && matchSearch;
    });

    if (error) return <ErrorScreen message="Aucun lieu trouvé !" />;
    if (!userLocation) return <LoadingView />;

    return (
        <SafeAreaView style={styles.safeArea}>
            <Row style={{ marginLeft: 0 }}>
                <BurgerMenu />
            </Row>

            <Title text={'Liste des lieux à proximité'} />

            <FiltreButtons 
                selectedTypeIds={selectedTypeIds}
                onPress={handleFilterPress} 
            />

            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            {filteredPlaces.length > 0 ? (
                <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                    <ScrollView style={{ marginBottom: 50 }}>
                        {filteredPlaces.map((item) => (
                            <Card key={item.id.toString()} place={item} />
                        ))}
                    </ScrollView>
                </Animated.View>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text>Aucun lieu trouvé à proximité.</Text>
                </View>
            )}

            <SwitchMapButton isMapView={false} /> 
            <Navigation />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colorButtonThird,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});