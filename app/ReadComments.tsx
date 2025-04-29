import { BurgerMenu } from "@/components/BurgerMenu/BurgerMenu";
import { Row } from "@/components/Row";
import { Title } from "@/components/Title";
import { useReadAllComments } from "@/hooks/comments/useAllComments";
import { useLocalSearchParams } from "expo-router";
import { FlatList } from "react-native-gesture-handler";

import { View, SafeAreaView } from "react-native";

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
                <BurgerMenu />
            </Row>
            <Title text={"Avis des membres"} />
            <Title text={params.nomLieu} />
            <FlatList 
                data={comments} 
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Title text={item.commentaire} />
                        <Title text={`Note : ${item.note}`} />
                        <Title text={`Date : ${item.date}`} />
                        <Title text={`Utilisateur : ${item.user}`} />
                    </View>
                )}
            />
        </SafeAreaView>
    );
}