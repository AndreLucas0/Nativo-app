
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Flame, Zap, Heart } from "lucide-react-native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import CardUnidade from "../components/cardUnidade";
import { BookOpen } from 'lucide-react-native';
import TrilhaItem from "../components/trilhaItem";

export default function Index() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../../assets/fonts/Space_Mono/SpaceMono-Regular.ttf"),
    SpaceMonoBold: require("../../assets/fonts/Space_Mono/SpaceMono-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const trilha = [
    {
      titulo: "CONHECENDO O EXPO",
      rota: "/ranking",
    },
    {
      titulo: "COMPONENTES ESSENCIAIS",
      rota: "/",
    },
    {
      titulo: "COMANDOS & ESTRUTURA",
      rota: "/",
    },
  ];

  const posicoes = ["left", "center", "right"] as const;


  return (
    <ScrollView >
      <View style={styles.container}>

        {/* HEADER */}
        <View
          style={styles.header}
        >
          {/* ESQUERDA */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* LOGO */}
            <View style={styles.logo}>
              <Text style={{ fontSize: 23, fontWeight: "bold", color: "#000" }}>
                N
              </Text>
            </View>

            {/* TITULO */}
            <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "bold" }}>
              Nativo
            </Text>
          </View>

          {/* DIREITA */}
          <View style={styles.statsContainer}>
            {/* FOGO */}
            <View style={styles.statItem}>
              <Flame size={20} color="#FF7A00" />
              <Text
                style={{
                  color: "#FF7A00",
                  marginLeft: 4,
                  fontWeight: "bold",
                }}
              >
                1
              </Text>
            </View>

            {/* ENERGIA */}
            <View style={styles.statItem}>
              <Zap size={20} color="#FFD60A" fill="#FFD60A" />
              <Text
                style={{
                  color: "#FFD60A",
                  marginLeft: 4,
                  fontWeight: "bold",
                }}
              >
                18
              </Text>
            </View>

            {/* VIDA */}
            <View
              style={styles.statItem}>
              <Heart size={20} color="#FF4D6D" fill="#FF4D6D" />
              <Text
                style={{ color: "#FF4D6D", marginLeft: 4, fontWeight: "bold", }}>
                5
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={{ color: "#FFF", fontSize: 25, fontWeight: "bold", marginLeft: 20, marginTop: 20, marginRight: 20, }} >
            Aprenda{" "}
            <Text style={{ color: "#9EF01A" }}>
              Expo
            </Text>
            {" "}e{" "}
            <Text style={{ color: "#00AED1" }}>
              React Native
            </Text>
            {" "}com a Nativo!
          </Text>
        </View>

        {/* UNIDADE 1  ------------------------------------------------------------------*/}


        <CardUnidade
          titulo="Básico - Introdução a Expo"
          numero={1}
          tema="verde"
          icon={<BookOpen size={30} color="#9EF01A" />}
        />

        <View style={styles.container}>
          {trilha.map((item, index) => (
            <TrilhaItem
              key={index}
              titulo={item.titulo}
              rota={item.rota}
              posicao={posicoes[index % 3]}
            />
          ))}
        </View>


        {/* UNIDADE 2  ------------------------------------------------------------------*/}

        <CardUnidade
          titulo="Intermediário - Componentes"
          numero={2}
          tema="azul"
          icon={<BookOpen size={30} color="#00AED1" />}
        />




      </View >
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 2,
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingTop: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#9d9d9d",
    paddingBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#9EF01A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    marginLeft: 4,
    fontWeight: "bold",
  },

});
