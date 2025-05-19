import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colorButtonFirst } from '../../style/styles';
import ExitButton from '../ExitButton';

type ConfirmationModalProps = {
    visible: boolean;
    email: string;
    onClose: () => void;
    title?: string;
    customContent?: React.ReactNode;
}

export function ConfirmationModal({ 
    visible, 
    email, 
    onClose, 
    title = "Demande envoyée", 
    customContent 
}: ConfirmationModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Bouton de fermeture (croix) */}
                    <ExitButton onPress={onClose} style={styles.exitButton} />
                    
                    <View style={styles.contentContainer}>
                        {/* Titre de la modal */}
                        <Text style={styles.modalTitle}>{title}</Text>
                        
                        {/* Contenu principal */}
                        {customContent || (
                            <Text style={styles.modalText}>
                                Un email de réinitialisation a été envoyé à {'\n'}
                                <Text style={styles.emailText}>{email}</Text> {'\n\n'}
                                si cette adresse est reconnue dans notre système.
                            </Text>
                        )}
                        
                        {/* Bouton d'action principal */}
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 450,
        backgroundColor: 'white',
        borderRadius: 25,
        paddingTop: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
        position: 'relative',
    },
    contentContainer: {
        width: '100%',
        paddingHorizontal: 35,
        paddingTop: 80,  // Augmenté pour plus d'espace
        paddingBottom: 35,
        alignItems: 'center',
    },
    exitButton: {
        position: 'absolute',
        top: 25,
        right: 25,
        zIndex: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,  // Ajouté pour plus d'espace
    },
    modalText: {
        fontSize: 17,
        color: '#555',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 26,
    },
    emailText: {
        fontWeight: 'bold',
        color: colorButtonFirst,
    },
    modalButton: {
        backgroundColor: colorButtonFirst,
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 60,
        minWidth: 180,
        marginTop: 10,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ConfirmationModal;