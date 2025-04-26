import { BurgerMenu } from "@/components/BurgerMenu/BurgerMenu";
import { Row } from "@/components/Row";
import { Title } from "@/components/Title";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReadReviews() {
    const params = useLocalSearchParams() as { lieuId: string, nomLieu: string  };
    const lieuId = params.lieuId?.toString() || "2";



    return (
        <SafeAreaView>
            {/* Menu burger */}
            <Row style={{ marginLeft: 0 }}>
                <BurgerMenu />
            </Row>
            <Title text={"Avis des membres"} />
            <Title text={params.nomLieu} />
        </SafeAreaView>
    );
}