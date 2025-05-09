/**
 * Module de réinitialisation de mot de passe
 * 
 * Ce composant permet à l'utilisateur de saisir le code de réinitialisation reçu par email
 * et de définir un nouveau mot de passe. Il fait partie du flux de récupération de mot de passe
 * et suit l'écran de demande d'envoi du code.
 * 
 * @module SendResetCode
 */

import { Platform, KeyboardAvoidingView, SafeAreaView, ScrollView, View, StyleSheet, Text, Alert, Modal, ActivityIndicator } from "react-native";
import BackButton from "../components/BackButton";
import { router, useLocalSearchParams } from "expo-router";
import AppLogo from "../components/AppLogo";
import FormInput from "../components/Form/InputField";
import { useEffect, useState } from "react";
import SubmitButton from "../components/Form/SubmitButton";
import { useResetPass } from "@/hooks/user/useResetPass";
import { Title } from '@/components/Title';

/**
 * Composant d'écran pour réinitialiser le mot de passe avec un code reçu par email
 * Permet à l'utilisateur de saisir le code et définir un nouveau mot de passe
 * @returns {JSX.Element} Le composant d'écran rendu
 */
export default function SendResetCode() {
    // États pour les champs du formulaire
    const [code, setCode] = useState('');  // Code de réinitialisation reçu par email
    const [newPassword, setNewPassword] = useState('');  // Nouveau mot de passe
    const [confirmPassword, setConfirmPassword] = useState('');  // Confirmation du mot de passe
    
    // Récupération de l'email depuis les paramètres de navigation
    const params = useLocalSearchParams() as { mail: string };
    
    // Hook personnalisé pour gérer la réinitialisation du mot de passe
    const { submit, success, loading, error } = useResetPass();

    /**
     * Gère la soumission du formulaire de réinitialisation de mot de passe
     * Valide les entrées et envoie la demande de réinitialisation à l'API
     */
    function handleResetPassword(): void {
        // Validation: le code de réinitialisation est requis
        if (!code) {
            Alert.alert('Erreur', 'Veuillez saisir le code de réinitialisation');
            return;
        }
        
        // Validation: les mots de passe doivent correspondre
        if (newPassword !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }
        
        // Soumission du formulaire avec les données validées
        submit({
            mail: params.mail,
            mot_de_passe: newPassword,
            token_reinitialisation: code
        });
    }

    /**
     * Effet pour gérer les résultats de la tentative de réinitialisation
     * Affiche un message de confirmation et redirige ou affiche une erreur
     */
    useEffect(() => {
        console.log('success', success);
        if (success) {
            // En cas de succès, afficher un message et rediriger vers l'accueil
            Alert.alert('Succès', 'Mot de passe changé');
            router.replace('/accueil');
        } else if (error) {
            // En cas d'erreur, afficher le message d'erreur
            Alert.alert('Erreur', error);
        }
    }, [success, error]);



    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Bouton de retour pour naviguer vers l'écran précédent */}
            <BackButton onPress={() => router.back()} style={styles.backButton} />

            {/* KeyboardAvoidingView ajuste la vue quand le clavier apparaît */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo de l'application */}
                    <View style={styles.logoContainer}>
                        <AppLogo size={120} />
                    </View>

                    {/* Titre de l'écran */}
                    <Title text={'Réinitilisation du mot de passe'} />

                    {/* Formulaire de réinitialisation */}
                    <View style={styles.formContainer}>
                        {/* Information sur l'adresse email où le code a été envoyé */}
                        <Text style={{ textAlign: 'center', marginBottom: 25 }}>
                            Un code a été envoyé à : {params.mail}
                        </Text>
                        
                        {/* Champ pour le code de réinitialisation */}
                        <FormInput
                            label="Code de réinitialisation"
                            value={code}
                            onChangeText={setCode}
                            placeholder="Code reçu par email"
                            keyboardType="default"
                        />

                        {/* Champ pour le nouveau mot de passe */}
                        <FormInput
                            label="Nouveau mot de passe"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="****"
                            secureTextEntry
                        />

                        {/* Champ pour confirmer le nouveau mot de passe */}
                        <FormInput
                            label="Confirmation mot de passe"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="****"
                            secureTextEntry
                        />

                        {/* Bouton pour soumettre le formulaire */}
                        <SubmitButton
                            title="Réinitialiser mot de passe"
                            onPress={handleResetPassword}
                        />
                    </View>
                </ScrollView>
                
                {/* Modal de chargement pendant la réinitialisation */}
                <Modal
                    visible={loading}
                    transparent
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <ActivityIndicator size="large" color="#007AFF" />
                            <Text style={styles.modalText}>Mise à jour du mot de passe en cours...</Text>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

/**
 * Styles pour l'écran de réinitialisation de mot de passe
 */
const styles = StyleSheet.create({
    // Style pour la zone sécurisée qui évite les encoches et éléments système
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // Style du conteneur principal
    container: {
        flex: 1,
    },
    // Style du contenu défilable avec marge inférieure
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    // Style du bouton retour positionné en haut à gauche
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 20,
        zIndex: 10,
    },
    // Style du conteneur du logo
    logoContainer: {
        alignItems: 'center',
        marginTop: 35,
    },
    // Style alternatif pour le logo (non utilisé mais conservé)
    logo: {
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    // Style du conteneur du formulaire
    formContainer: {
        width: '100%',
        paddingHorizontal: 25,
        marginTop: 20,
    },
    // Styles pour le modal de chargement
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fond semi-transparent
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        marginTop: 10,
        fontSize: 16,
    },
});