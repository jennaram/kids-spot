// Composant FiltreButtons : ensemble de boutons pour filtrer les lieux par catégorie (Restaurant, Loisir, Culture)

import React from 'react';
import { Row } from '@/components/Row';
import { FiltreButton } from '@/components/Filtres/Button';

// Typage des props attendues par FiltreButtons
interface FilterProps {
    selectedTypeId: number | null; // ID du type actuellement sélectionné
    onPress: (id: number | null) => void; // Fonction déclenchée au clic sur un bouton
}

// Définition du composant
const FiltreButtons: React.FC<FilterProps> = ({ selectedTypeId, onPress }) => {
    return (
        <Row style={{ gap: 10 }}>
            {/* Bouton pour filtrer sur les Restaurants */}
            <FiltreButton
                type="Restaurant"
                typeId={1}
                onPress={onPress}
                selectedTypeId={selectedTypeId}
            />

            {/* Bouton pour filtrer sur les Loisirs */}
            <FiltreButton
                type="Loisir"
                typeId={2}
                onPress={onPress}
                selectedTypeId={selectedTypeId}
            />

            {/* Bouton pour filtrer sur la Culture */}
            <FiltreButton
                type="Culture"
                typeId={3}
                onPress={onPress}
                selectedTypeId={selectedTypeId}
            />
        </Row>
    );
};

export default FiltreButtons;