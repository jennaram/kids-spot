import React from 'react';
import { Row } from '@/components/Row';
import { FiltreButton } from '@/components/Filtres/Button';

interface FilterProps {
    selectedTypeIds: number[]; // Maintenant un tableau d'IDs
    onPress: (id: number) => void; // La fonction ne gère plus le null
}

const FiltreButtons: React.FC<FilterProps> = ({ selectedTypeIds, onPress }) => {
    return (
        <Row style={{ gap: 10 }}>
            {/* Bouton pour filtrer sur les Restaurants */}
            <FiltreButton
                type="Restaurants"
                typeId={1}
                onPress={onPress}
                isSelected={selectedTypeIds.includes(1)}
            />

            {/* Bouton pour filtrer sur les Loisirs */}
            <FiltreButton
                type="Loisirs"
                typeId={2}
                onPress={onPress}
                isSelected={selectedTypeIds.includes(2)}
            />

            {/* Bouton pour filtrer sur la Culture */}
            <FiltreButton
                type="Culture"
                typeId={3}
                onPress={onPress}
                isSelected={selectedTypeIds.includes(3)}
            />
        </Row>
    );
};

export default FiltreButtons;