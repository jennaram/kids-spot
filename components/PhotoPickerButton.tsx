import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, View, TouchableOpacity, Image, Text, Alert } from 'react-native';
import { colorButtonFirst } from 'app/style/styles';
import { useEffect, useState } from 'react';


type Props = {
    onPhotoSelected: (uri: string) => void;
    initialImage?: string;
}

export function PhotoPickerButton({ onPhotoSelected , initialImage}: Props) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        // Si une initialImage est fournie, mettez à jour l'état local
        if (initialImage) {
            setSelectedImage(initialImage);
        }
    }, [initialImage]);

    const pickImage = async (source: 'camera' | 'library') => {
        try {
            let result;
            
            if (source === 'camera') {
                const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
                if (!cameraPermission.granted) {
                    Alert.alert('Permission requise', 'Nous avons besoin de la permission de la caméra pour prendre une photo.');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.1,
                });
            } else {
                const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!libraryPermission.granted) {
                    Alert.alert('Permission requise', 'Nous avons besoin de la permission de la galerie pour sélectionner une photo.');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.1,
                });
            }

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                setSelectedImage(uri);
                onPhotoSelected(uri);
            }
        } catch (error) {
            console.error('Erreur lors de la sélection de l\'image:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image');
        }
    };

    return (
        <View style={styles.container}>
            {selectedImage ? (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: selectedImage }} style={styles.image} />
                    <TouchableOpacity 
                        style={styles.changeButton} 
                        onPress={() => setSelectedImage(null)}
                    >
                        <MaterialIcons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.buttonGroup}>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={() => pickImage('camera')}
                    >
                        <MaterialIcons name="photo-camera" size={24} color="white" />
                        <Text style={styles.buttonText}>Prendre une photo</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={() => pickImage('library')}
                    >
                        <MaterialIcons name="photo-library" size={24} color="white" />
                        <Text style={styles.buttonText}>Choisir une photo</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colorButtonFirst,
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    changeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 5,
    },
});