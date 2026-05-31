import { View, Text, StyleSheet, Pressable } from "react-native";
import { Check, Star } from "lucide-react-native";
import { router } from "expo-router";

type Tema = "verde" | "azul" | "amarelo";

type Props = {
  titulo: string;
  posicao: "left" | "center" | "right";
  rota: string;
  tema?: Tema;
};

const coresTema = {
  verde:   { main: "#8AE234", shelf: "#4E7A00" },
  azul:    { main: "#1AC8EC", shelf: "#0080A0" },
  amarelo: { main: "#FFD60A", shelf: "#9A7C00" },
};

export default function TrilhaItem({ titulo, posicao, rota, tema = "verde" }: Props) {
  const cor = coresTema[tema];
  const alignSelf =
    posicao === "left" ? "flex-start" : posicao === "right" ? "flex-end" : "center";

  return (
    <View style={[styles.container, { alignSelf }]}>
      <View style={styles.buttonWrapper}>
        {/* Shelf escura → cria efeito 3D */}
        <View style={[styles.shelf, { backgroundColor: cor.shelf }]} />

        {/* Círculo principal com press-down */}
        <Pressable
          style={({ pressed }) => [
            styles.circle,
            {
              backgroundColor: cor.main,
              transform: [{ translateY: pressed ? 5 : 0 }],
            },
          ]}
          onPress={() => router.push(rota)}
        >
          <Check size={38} color="#000" strokeWidth={4} />
        </Pressable>

        {/* Estrela */}
        <View style={styles.starBadge}>
          <Star size={13} color="#FFD43B" fill="#FFD43B" />
        </View>
      </View>

      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
    alignItems: "center",
    width: 130,
  },
  buttonWrapper: {
    width: 90,
    height: 96,
    position: "relative",
  },
  shelf: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  circle: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  starBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#131f24",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1e2f38",
  },
  titulo: {
    color: "#fff",
    marginTop: 12,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 11,
    letterSpacing: 0.8,
  },
});
