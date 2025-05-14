import { colorButtonFirst, fontSubtitle } from "@/app/style/styles";
import { Link } from "expo-router";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useState } from "react";
import { Place } from '@/types/place';
import { IMAGE_BASE_URL } from '@/api/apiConfig';
// URL de base pour charger les images depuis internet


type Props = {
    place: Place;
};

export function Card({ place }: Props) {
    // Gère l'erreur de chargement d'image
    const [imageError, setImageError] = useState(false);
    return (
        <Link href={{ pathname: "/details_lieu", params: { id: place.id } }} asChild>
            <Pressable>
                <View style={styles.card}>
                    
                    {/* Image du lieu, ou image locale si erreur */}
                    <Image
                        source={
                            imageError
                                ? require('@/assets/images/carte.png')
                                : { uri: `${IMAGE_BASE_URL}${place.id}.jpg` }
                        }
                        style={styles.image}
                        onError={() => setImageError(true)}
                    />

                    {/* Informations sur le lieu */}
                    <View style={styles.textContainer}>
                        <Text style={[fontSubtitle]}>{place.nom}</Text>
                        {place.type && place.type.length > 0 && (
                            <Text style={styles.description}>
                                Type: {place.type.map(t => t.nom).join(', ')}
                            </Text>
                        )}
                        <Text style={styles.info}>Horaires : {place.horaires}</Text>
                    </View>

                    {/* Distance du lieu */}
                    <Text style={styles.distance}>
                        {place.position.distance_km.toFixed(2)} km
                    </Text>
                </View>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        margin: 12,
        marginBottom: 12,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: '#ddd',
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
        marginLeft: 8,
        fontWeight: '600',
        color: colorButtonFirst,
    }
});