import { colorButtonFirst, fontSubtitle } from "@/app/style/styles";
import { View, Text, StyleSheet } from "react-native"

type Place = {
    id: number;
    nom: string;
    horaires?: string;
    description?: string;
    adresse?: {
        adresse: string;
        code_postal: string;
        ville: string;
    };
    type?: {
        id: number;
        nom: string;
    }[];
    est_evenement: boolean;
    date_evenement?: {
        debut: string | null;
        fin: string | null;
    };
    position: {
        latitude: number;
        longitude: number;
        distance_km: number;
    };
    equipements?: any[];
    ages?: any[];
};

type Props = {
    place: Place;
};

export function Card({ place }: Props) {
    return <View style={styles.card}>

        <View style={styles.textContainer}>
            <Text style={[fontSubtitle]}>{place.nom}</Text>
            {place.type && place.type.length > 0 && (
                <Text style={styles.description}>
                    Type: {place.type.map(t => t.nom).join(', ')}
                </Text>
            )}
            <Text style={styles.info}>Horaires : {place.horaires}</Text>
        </View>
        <Text style={styles.distance}>{place.position.distance_km.toFixed(2)} km</Text>
    </View>
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        margin: 12,
        marginBottom: 12,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        flexDirection:'row'
    },
    textContainer: {
        flex: 1,
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    info: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
    },
    distance: {
        marginTop:"auto",
        marginBottom:"auto",
        marginLeft: 8,
        fontWeight: '600',
        color: colorButtonFirst
    }
})

