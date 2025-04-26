// FiltreButtons.tsx
import React from 'react';
import { Row } from '@/components/Row';
import { FiltreButton } from '@/components/Filtres/Button';

interface FilterProps {
    selectedTypeId: number | null;
    onPress: (id: number | null) => void;
}

const FiltreButtons: React.FC<FilterProps> = ({ selectedTypeId, onPress }) => {
    return (
        <Row style={{ gap: 10 }}>
            <FiltreButton
                type="Restaurant"
                typeId={1}
                onPress={onPress}
                selectedTypeId={selectedTypeId}
            />
            <FiltreButton
                type="Loisir"
                typeId={2}
                onPress={onPress}
                selectedTypeId={selectedTypeId}
            />
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