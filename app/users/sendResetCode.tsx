import { Platform, SafeAreaView, ScrollView, View, StyleSheet, Text, Alert } from "react-native";
import BackButton from "../components/BackButton";
import { router, useLocalSearchParams } from "expo-router";
import AppLogo from "../components/AppLogo";
import FormInput from "../components/Form/InputField";
import { useEffect, useState } from "react";
import SubmitButton from "../components/Form/SubmitButton";
import { useResetPass } from "@/hooks/user/useResetPass";

export default function SendResetCode() {
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const params = useLocalSearchParams() as { mail: string };
    const { submit, success, loading, error} = useResetPass();

    function handleResetPassword(): void {
        if (!code) {
            Alert.alert('Erreur', 'Veuillez saisir le code de réinitialisation');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }
        submit({
            mail: params.mail,
            mot_de_passe: newPassword,
            token_reinitialisation: code
        });
    }

    useEffect(() => {
        console.log('success', success);
        if (success) {
            Alert.alert('Succès', 'Mot de passe changé');
            router.replace('/accueil');
        } else if (error) {
            Alert.alert('Erreur', error);
        }
    }, [success, error]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <BackButton onPress={() => router.back()} style={styles.backButton} />


            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo centré en haut avec espacement */}
                <View style={styles.logoContainer}>
                    <AppLogo size={150} />
                </View>


                <View style={styles.formContainer}>
                    <Text style={{ textAlign: 'center', marginBottom: 10 }}>
                        Un code a été envoyé à : {params.mail}
                    </Text>
                    <FormInput
                        label="Code de réinitialisation"
                        value={code}
                        onChangeText={setCode}
                        placeholder="Code reçu par email"
                        keyboardType="default"
                    />

                    <FormInput
                        label="Nouveau mot de passe"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="****"
                        secureTextEntry
                    />

                    <FormInput
                        label="Confirmation mot de passe"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="****"
                        secureTextEntry
                    />

                    <SubmitButton
                        title="Réinitialiser mot de passe"
                        onPress={handleResetPassword}
                        loading={loading}
                    />
                </View>
            </ScrollView>



        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 20,
        zIndex: 10,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    logo: {
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    formContainer: {
        width: '100%',
        paddingHorizontal: 25,
        marginTop: 20,
    },
});