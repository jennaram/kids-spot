import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Animated, View, StyleSheet, Text } from 'react-native';
import { colorButtonThird } from './style/styles';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/NavBar/Navigation';
import { Card } from '@/components/LitleCard/Card';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { useLocation } from '@/context';
import { SwitchButton } from '@/components/switchButtonMapList';
import FiltreButtons from '@/components/Filtres/FiltreButtons';
import { useFadeInOut } from '@/components/Filtres/Animation';
import { Place } from '@/Types/types';
import { Row } from '@/components/Row';
import LoadingView from '@/components/Messages/LocationLoading';
import ErrorView from '@/components/Messages/ErrorView';
import SearchBar from '@/components/Filtres/SearchBar';

export default function NearbyPlacesScreen() {
    const { userLocation, nearbyPlaces, error, refreshLocation } = useLocation();
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { fadeAnim, fadeIn, fadeOut } = useFadeInOut();

    const handleFilterPress = (typeId: number | null) => {
        setSelectedTypeId(typeId);
    };

    const filteredPlaces = (nearbyPlaces ?? []).filter((place: Place) => {
        const matchType = selectedTypeId
            ? place.type?.some((t) => t.id === selectedTypeId)
            : true;

        const matchSearch = place.nom.toLowerCase().includes(searchQuery.toLowerCase());

        return matchType && matchSearch;
    });

    if (error) {
        return <ErrorView error={error} />;
    }

    if (!userLocation) {
        return <LoadingView />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Row style={{ marginLeft: 0 }}>
                <BurgerMenu />
            </Row>

            <Title text={'Liste des lieux à proximité'} />

            <FiltreButtons selectedTypeId={selectedTypeId} onPress={(id) => fadeOut(() => handleFilterPress(id))} />

            {/* Utilisation du composant SearchBar */}
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            {/* Liste des lieux filtrés */}
            {filteredPlaces.length > 0 ? (
                <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                    <ScrollView>
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

            <SwitchButton type={'liste'} />
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