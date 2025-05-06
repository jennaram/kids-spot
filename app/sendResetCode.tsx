import { SafeAreaView } from "react-native";

export default function SendResetCode() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <BackButton onPress={() => router.back()} style={styles.backButton} />

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
                    {/* Logo centré en haut avec espacement */}
                    <View style={styles.logoContainer}>
                        <AppLogo size={150} />
                    </View>


                    <View style={styles.formContainer}>
                        <FormInput
                            label="Adresse mail"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="email@exemple.com"
                            keyboardType="email-address"
                        />

                        <SubmitButton
                            title="Réinitialiser mot de passe"
                            onPress={handleResetPassword}
                            loading={loading}
                        />
                    </View>
                </ScrollView>

                <ConfirmationModal
                    visible={showConfirmation}
                    email={email}
                    onClose={closeModalAndRedirect}
                    title="Email envoyé"
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}