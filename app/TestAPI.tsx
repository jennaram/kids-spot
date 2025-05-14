import React, { useState, useEffect } from 'react';
import { View, Button, Image, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'L\'application a besoin de la permission d\'accéder à votre galerie.'
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        setImage(selectedImageUri);
        await uploadImageToCloudinary(selectedImageUri);
      }
    } catch (error) {
      //console.error('Erreur lors de la sélection de l’image :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection.');
    }
  };

  const uploadImageToCloudinary = async (imageUri: string) => {
    const cloudName = 'dtovi7wy6';
    const uploadPreset = 'kids-spot';
    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      setUploading(true);

      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append('file', `data:image/jpeg;base64,${base64}`);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      //console.log('Réponse Cloudinary :', data);

      if (data && data.secure_url) {
        Alert.alert('Succès', 'Image téléversée avec succès !');
      } else {
        Alert.alert('Erreur', 'Le téléversement a échoué.');
      }
    } catch (error) {
      console.error('Erreur lors du téléversement vers Cloudinary :', error);
      Alert.alert('Erreur', 'Une erreur est survenue pendant le téléversement.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Sélectionner une image depuis la galerie" onPress={pickImage} />
      {uploading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  loader: {
    marginTop: 20,
  },
});