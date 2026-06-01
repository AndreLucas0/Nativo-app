import { View, Text, StyleSheet, Pressable } from "react-native";
import { Check, Star, Lock } from "lucide-react-native";
import { router } from "expo-router";

type Tema = "verde" | "azul" | "amarelo";

type Props = {
  titulo: string;
  posicao: "left" | "center" | "right";
  rota: string;
  tema?: Tema;
  locked?: boolean;
};

const coresTema = {
  verde:   { main: "#8AE234", shelf: "#4E7A00" },
  azul:    { main: "#1AC8EC", shelf: "#0080A0" },
  amarelo: { main: "#FFD60A", shelf: "#9A7C00" },
};

export default function TrilhaItem({ titulo, posicao, rota, tema = "verde", locked = false }: Props) {
  const cor = coresTema[tema];
  const alignSelf =
    posicao === "left" ? "flex-start" : posicao === "right" ? "flex-end" : "center";

  return (
    <View style={[styles.container, { alignSelf }, locked && styles.containerLocked]}>
      <View style={styles.buttonWrapper}>
        {/* Shelf escura → cria efeito 3D */}
        <View style={[styles.shelf, { backgroundColor: locked ? "#2a2a2a" : cor.shelf }]} />

        {/* Círculo principal com press-down */}
        <Pressable
          style={({ pressed }) => [
            styles.circle,
            {
              backgroundColor: locked ? "#333" : cor.main,
              transform: [{ translateY: pressed && !locked ? 5 : 0 }],
            },
          ]}
          onPress={() => !locked && router.push(rota)}
          disabled={locked}
        >
          {locked
            ? <Lock size={32} color="#666" strokeWidth={2.5} />
            : <Check size={38} color="#000" strokeWidth={4} />
          }
        </Pressable>

        {/* Estrela — oculta quando bloqueado */}
        {!locked && (
          <View style={styles.starBadge}>
            <Star size={13} color="#FFD43B" fill="#FFD43B" />
          </View>
        )}
      </View>

      <Text style={[styles.titulo, locked && styles.tituloLocked]}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
    alignItems: "center",
    width: 130,
  },
  containerLocked: {
    opacity: 0.5,
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
  tituloLocked: {
    color: "#555",
  },
});
