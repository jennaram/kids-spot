import { BurgerMenu } from "@/components/BurgerMenu/BurgerMenu";
import { Row } from "@/components/Row";
import { Title } from "@/components/Title";
import { useReadAllComments } from "@/hooks/comments/useAllComments";
import { useLocalSearchParams } from "expo-router";

import { View, SafeAreaView, FlatList, StyleSheet, Text} from "react-native";
import BackButton from "./components/BackButton";

export default function ReadReviews() {
    const params = useLocalSearchParams() as { lieuId: string, nomLieu: string  };
    const lieuId = params.lieuId?.toString() || "2";
    const {comments, loading, error} = useReadAllComments(Number(lieuId));

    if (loading) {
        return <Title text="Chargement en cours..." />;
    }
    if (error) {
        return <Title text="Erreur chargement des commentaires" />;
    }
    if (!comments) {
        return <Title text="Aucun commentaire trouvé" />;
    }
    console.log(lieuId);
    return (
        <SafeAreaView>
            {/* Menu burger */}
            <Row style={{ marginLeft: 0 }}>
                <BackButton style={styles.backButton} />
            </Row>
            <Title text={"Avis des membres"} />
            <Title text={params.nomLieu} />
            <FlatList 
  data={comments} 
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentText}>{item.commentaire}</Text>
      <Text style={styles.noteText}>⭐ Note : {item.note}</Text>
      <Text style={styles.dateText}>📅 Date : {item.date.ajout}</Text>
      <Text style={styles.userText}>👤 Utilisateur : {item.user.pseudo}</Text>
    </View>
  )}
/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        top: 0,
        left: 15
    },
    commentContainer: {
      backgroundColor: '#f8f8f8',
      borderRadius: 10,
      padding: 12,
      marginVertical: 8,
      marginHorizontal: 16,
      elevation: 2, // pour Android (ombre)
      shadowColor: '#000', // pour iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    commentText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    noteText: {
      fontSize: 14,
      color: '#444',
      marginBottom: 2,
    },
    dateText: {
      fontSize: 13,
      color: '#666',
      marginBottom: 2,
    },
    userText: {
      fontSize: 13,
      color: '#888',
    },
  });
  