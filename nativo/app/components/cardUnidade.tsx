import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";

type Tema = "verde" | "azul" | "amarelo";

type Props = {
  titulo: string;
  numero: number;
  tema?: Tema;
  icon: ReactNode;
};

const temas = {
  verde: {
    borderColor: "#9EF01A",
    shadowColor: "#5BE000",
    textColor: "#9EF01A",
    gradient: ["#3a6200", "#162800", "#131f24"] as const,
  },
  azul: {
    borderColor: "#00AED1",
    shadowColor: "#0086b7",
    textColor: "#00AED1",
    gradient: ["#00384a", "#001b24", "#131f24"] as const,
  },
  amarelo: {
    borderColor: "#FFD60A",
    shadowColor: "#FFB300",
    textColor: "#FFD60A",
    gradient: ["#6b5a00", "#3a3000", "#131f24"] as const,
  },
};

export default function CardUnidade({
  titulo,
  numero,
  tema = "verde",
  icon,
}: Props) {

  const temaAtual = temas[tema];

  return (
    <LinearGradient
      colors={temaAtual.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.card,
        {
          borderColor: temaAtual.borderColor,
          shadowColor: temaAtual.shadowColor,
        },
      ]}
    >
      <View style={styles.IconUnidade}>
        {icon}
      </View>

      <View>
        <Text
          style={[
            styles.unidade,
            {
              color: temaAtual.textColor,
            },
          ]}
        >
          UNIDADE {numero}
        </Text>

        <Text style={styles.texto}>
          {titulo}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    padding: 20,

    borderRadius: 18,

    flexDirection: "row",
    alignItems: "center",

    gap: 12,

    alignSelf: "center",

    marginTop: 20,

    borderWidth: 2,

    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 8,
  },

  unidade: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 4,
  },

  IconUnidade: {
    width: 45,
    height: 45,

    borderRadius: 12,

    backgroundColor: "#101A00",

    alignItems: "center",
    justifyContent: "center",
  },

  texto: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
});