import React, { useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackButton } from "app/components/BackButton";
import { Title } from "@/components/Title";
import { SubmitButton } from "@/app/components/Form/SubmitButton";
import { Navigation } from "@/components/NavBar/Navigation";
import { styles } from "@/app/style/about.styles"; // Style principal
import { modalStyles } from "@/app/style/about.styles"; // Style du modal

// Styles locaux pour le composant About
const localStyles = StyleSheet.create({
  buttonSpacing: {
    height: 10, // Espacement vertical entre les boutons
  }
});

const About = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // État pour gérer l'affichage du modal des mentions légales
  const [legalModalVisible, setLegalModalVisible] = useState(false);

  // Fonction pour ouvrir le modal des mentions légales
  const openLegalModal = () => {
    setLegalModalVisible(true);
  };

  // Fonction pour fermer le modal des mentions légales
  const closeLegalModal = () => {
    setLegalModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* BOUTON RETOUR EN HAUT À GAUCHE */}
      <View style={{
        position: 'absolute',
        top: Platform.select({ ios: 10, android: 5 }), // Position ultra-haute
        left: 10,
        zIndex: 100,
      }}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: 50 }]}
        showsVerticalScrollIndicator={false}
      >
        <Title text="À propos" />
        
        <View style={styles.container}>
            
             <View style={styles.textContainer}>
              <Text style={styles.description}>
                "Une app pensée <Text style={styles.bold}>PAR</Text> des parents,{" "}
                <Text style={styles.bold}>POUR</Text> des parents !"
              </Text>
              <Text style={styles.description}>
                Kids Spot, c'est le GPS des sorties familiales & kids-friendly en
                Île-de-France !
              </Text>
              <Text style={styles.description}>
                Oubliez les recherches interminables et les déceptions : nous
                avons recensé pour vous de nombreuses adresses avec un critère
                imparable :
              </Text>
              <Text style={[styles.description, styles.bold]}>
                " Est-ce accessible pour nos propres enfants ? "
              </Text>

              <Text style={styles.subtitle}>Pourquoi utiliser cette app ?</Text>

              <View style={styles.bulletPoint}>
                <MaterialIcons name="search" size={20} color="#555" />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>Sélection rigoureuse</Text> : Des
                  lieux kids-friendly testés sur le terrain par d'autres parents.
                </Text>
              </View>

              <View style={styles.bulletPoint}>
                <MaterialIcons name="star" size={20} color="#555" />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>Avis</Text> : Possibilité de consulter les avis.
                </Text>
              </View>

              <View style={styles.bulletPoint}>
                <MaterialIcons name="event" size={20} color="#555" />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>Actualisation permanente</Text> :
                  Nouveaux spots ajoutés régulièrement.
                </Text>
              </View>

              <View style={styles.bulletPoint}>
                <MaterialIcons name="filter-list" size={20} color="#555" />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>Filtres intelligents</Text> : Par âge,
                  type de lieu et équipements disponibles.
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <SubmitButton
                title="Nous contacter"
                onPress={() => navigation.navigate("contact")}
              />
              {/* Utilisation du style local pour l'espacement */}
              <View style={localStyles.buttonSpacing} />
              <SubmitButton
                title="Mentions légales"
                onPress={openLegalModal}
              />
            </View>
          </View>

          {/* Modal pour les mentions légales */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={legalModalVisible}
            onRequestClose={closeLegalModal}
          >
            <View style={modalStyles.centeredView}>
              <View style={modalStyles.modalView}>
                <View style={modalStyles.modalHeader}>
                  <Text style={modalStyles.modalTitle}>Mentions légales</Text>
                  <TouchableOpacity onPress={closeLegalModal} style={modalStyles.closeButton}>
                    <MaterialIcons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={modalStyles.modalScrollView} showsVerticalScrollIndicator={true}>
                  <Text style={modalStyles.legalText}>
                    MENTIONS LÉGALES{"\n\n"}

                    1. PRÉSENTATION DE L'APPLICATION MOBILE{"\n"}
                    Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique, dite L.C.E.N., nous portons à la connaissance des utilisateurs et visiteurs de l'application les informations suivantes :{"\n\n"}
                    
                    Propriétaire : Team Kids Spot{"\n\n"}
                    Email : kidspottp@gmail.com{"\n\n"}
                   
                    2. CONDITIONS GÉNÉRALES D'UTILISATION{"\n"}
                    L'utilisation de l'application implique l'acceptation pleine et entière des conditions générales d'utilisation décrites ci-après. Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment.{"\n\n"}

                    3. DONNÉES PERSONNELLES{"\n"}
                    Les informations recueillies font l'objet d'un traitement informatique destiné à améliorer l'expérience utilisateur. Conformément à la loi « informatique et libertés » du 6 janvier 1978 modifiée en 2004, vous bénéficiez d'un droit d'accès et de rectification aux informations qui vous concernent. Vous pouvez exercer ce droit en vous adressant à Team Kidspot.{"\n\n"}

                    4. PROPRIÉTÉ INTELLECTUELLE{"\n"}
                    Tous les éléments de l'application mobile Kids Spot (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) sont la propriété exclusive de la société à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.{"\n\n"}
                    
                    5. LIENS HYPERTEXTES ET COOKIES{"\n"}
                    L'application Kids Spot contient un certain nombre de liens hypertextes vers d'autres sites. Cependant, Kids Spot n'a pas la possibilité de vérifier le contenu ainsi visités, et n'assumera en conséquence aucune responsabilité de ce fait.{"\n\n"}
                    
                    6. RESPONSABILITÉ{"\n"}
                    Les sources des informations diffusées sur l'application sont réputées fiables. Toutefois, l'application se réserve la faculté d'une non-garantie de la fiabilité des sources. Les informations données sur l'application le sont à titre purement informatif. Ainsi, l'utilisateur assume seul l'entière responsabilité de l'utilisation des informations et contenus de l'application.{"\n\n"}

                    7. DROIT APPLICABLE ET JURIDICTION COMPÉTENTE{"\n"}
                    Les présentes conditions de l'application sont régies par les lois françaises et toute contestation ou litiges qui pourraient naître de l'interprétation ou de l'exécution de celles-ci seront de la compétence exclusive des tribunaux dont dépend le siège social de la société. La langue de référence, pour le règlement de contentieux éventuels, est le français.{"\n\n"}

                    8. CONTACT{"\n"}
                    Pour toute question relative à l'application des présentes mentions légales ou pour toute demande concernant l'application, vous pouvez nous contacter via notre formulaire de contact ou à l'adresse email : kidspottp@gmail.com .{"\n\n"}
                   
                    9. PROPRIETE PRIVEE - UTILISATION RESTREINTE{"\n\n"}

                    Ce projet, incluant son code source, ses ressources visuelles, ses documents et toute autre composante, est la propriété exclusive de TEAM KIDSPOT.{"\n\n"}

                    Toute reproduction, distribution ou utilisation de ce projet est strictement interdite sans l'autorisation expresse de ses auteurs.{"\n\n"}

                    Usage autorisé uniquement par les membres suivants : Jenna Bénuffé Ramiaramanantsoa, Moussa Kebe, Sebastien Drillaud, Ludovic Denis, Alexandre Fourquin{"\n\n"}

                    © TEAM KIDSPOT 2025{"\n\n"}
                  </Text>
                </ScrollView>
                
                <View style={modalStyles.modalFooter}>
                  <TouchableOpacity
                    style={modalStyles.closeButtonFooter}
                    onPress={closeLegalModal}
                  >
                    <Text style={modalStyles.closeButtonText}>Fermer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.bottomSpacer} />

        </ScrollView>
      <Navigation />
    </SafeAreaView>
  );
};

export default About;