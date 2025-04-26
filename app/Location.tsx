import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Animated, View, StyleSheet, Text } from 'react-native';
import { colorButtonThird } from './style/styles';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/NavBar/Navigation';
import { Card } from '@/components/LitleCard/Card';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { useLocation } from '@/context/locate';
import { SwitchButton } from '@/components/switchButtonMapList';
import FiltreButtons from '@/components/Filtres/FiltreButtons';
import { useFadeInOut } from '@/hooks/Animation';
import { Place } from '@/Types/place';
import { Row } from '@/components/Row';
import LoadingView from '@/components/Messages/LocationLoading';
import SearchBar from '@/components/Filtres/SearchBar';
import ErrorScreen from '@/components/ErrorScreen';

export default function NearbyPlacesScreen() {
    // Récupération des données de localisation
    const { userLocation, nearbyPlaces, error, refreshLocation } = useLocation();
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { fadeAnim, fadeIn, fadeOut } = useFadeInOut();

    // Gère la sélection d'un filtre
    const handleFilterPress = (typeId: number | null) => {
        setSelectedTypeId(typeId);
    };

    // Applique les filtres type et recherche
    const filteredPlaces = (nearbyPlaces ?? []).filter((place: Place) => {
        const matchType = selectedTypeId
            ? place.type?.some((t) => t.id === selectedTypeId)
            : true;

        const matchSearch = place.nom.toLowerCase().includes(searchQuery.toLowerCase());

        return matchType && matchSearch;
    });

    if (error) return <ErrorScreen message="Aucun lieu de trouvé !" />;

    if (!userLocation) {
        // Affiche un loader pendant la récupération de la localisation
        return <LoadingView />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Menu burger */}
            <Row style={{ marginLeft: 0 }}>
                <BurgerMenu />
            </Row>

            {/* Titre principal */}
            <Title text={'Liste des lieux à proximité'} />

            {/* Filtres par type */}
            <FiltreButtons selectedTypeId={selectedTypeId} onPress={(id) => fadeOut(() => handleFilterPress(id))} />

            {/* Barre de recherche */}
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            {/* Liste filtrée des lieux */}
            {filteredPlaces.length > 0 ? (
                <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                    <ScrollView>
                        {filteredPlaces.map((item) => (
                            <Card key={item.id.toString()} place={item} />
                        ))}
                    </ScrollView>
                </Animated.View>
            ) : (
                // Message si aucun lieu n'est trouvé
                <View style={styles.emptyContainer}>
                    <Text>Aucun lieu trouvé à proximité.</Text>
                </View>
            )}

            {/* Bouton pour basculer la vue liste/carte */}
            <SwitchButton type={'liste'} />

            {/* Barre de navigation */}
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