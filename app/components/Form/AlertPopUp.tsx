/**
 * Composant Modal de confirmation réutilisable
 * 
 * Rôle : Afficher une popup de confirmation avec un message personnalisable
 * 
 * Fonctionnalités principales :
 * 1. Affiche un message de confirmation après une action utilisateur
 * 2. Donne un retour visuel clair (succès/échec)
 * 3. Propose un bouton de fermeture et d'action principale
 * 4. Gère l'affichage conditionnel (visible/invisible)
 * 
 * Cas d'usage typiques :
 * - Confirmation d'envoi d'email (mot de passe oublié)
 * - Validation d'une action importante
 * - Accusé réception d'une demande
 * 
 * Props :
 * @param {boolean} visible - Contrôle l'affichage de la modal
 * @param {string} email - Email à afficher dans le message
 * @param {function} onClose - Callback quand l'utilisateur ferme la modal
 * @param {string} [title="Demande envoyée"] - Titre optionnel
 * @param {ReactNode} [customContent] - Contenu personnalisable optionnel
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colorButtonFirst } from '../../style/styles';
import ExitButton from '../ExitButton';


const ConfirmationModal: React.FC<{
  visible: boolean;
  email: string;
  onClose: () => void;
  title?: string;
  customContent?: React.ReactNode;
}> = ({ visible, email, onClose, title = "Demande envoyée", customContent }) => {
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    paddingTop: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  exitButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  emailText: {
    fontWeight: 'bold',
    color: colorButtonFirst,
  },
  modalButton: {
    backgroundColor: colorButtonFirst,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 50,
    minWidth: 150,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ConfirmationModal;