import { Row } from "@/components/Row";
import { Title } from "@/components/Title";
import { useReadAllComments } from "@/hooks/comments/useAllComments";
import { useLocalSearchParams } from "expo-router";

import { View, SafeAreaView, FlatList, StyleSheet, Text } from "react-native";
import BackButton from "./components/BackButton";
import { MaterialIcons } from "@expo/vector-icons";

export default function ReadReviews() {
  const params = useLocalSearchParams() as { lieuId: string, nomLieu: string };
  const lieuId = params.lieuId?.toString() || "2";
  const { comments, loading, error } = useReadAllComments(Number(lieuId));

  if (loading) {
    return <Title text="Chargement en cours..." />;
  }
  if (error) {
    return <Title text="Erreur chargement des commentaires" />;
  }
  if (comments.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Row style={{ marginLeft: 0 }}>
          <BackButton style={styles.backButton} />
        </Row>
        <Title text={"Avis des membres"} />
        <Title text={params.nomLieu} />
        <View style={styles.commentContainer}>
          <Text style={styles.commentText}>Aucun commentaire pour ce lieu</Text>
        </View>
      </SafeAreaView>
    );
  }

  console.log(comments.length);

  return (
    <SafeAreaView style={styles.container}>
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
            <View style={styles.header}>
              <Text style={styles.username}>{item.user.pseudo}</Text>
              <Text style={styles.date}>{item.date.ajout}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Row style={{marginLeft:0}}>
                <MaterialIcons
                  name="star"
                  size={18}
                  color="black"
                />
                <Text style={styles.rating}>{item.note}</Text>
              </Row>

            </View>
            <Text style={styles.commentText}>{item.commentaire}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    top: 0,
    left: 15
  },
  commentContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
  ratingContainer: {
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#555',
  },
  commentText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
  }
});