// ARQUIVO: app/components/trilhaItem.tsx
// Componente de nó da trilha de aprendizado: botão circular que representa
// uma lição dentro de um módulo. Pode estar desbloqueado (clicável) ou
// bloqueado (exibe cadeado e fica semi-transparente).
// Efeito 3D: um círculo escuro ("shelf") fica deslocado abaixo do círculo principal,
// criando a ilusão de profundidade ao pressionar.

import { View, Text, StyleSheet, Pressable } from "react-native";
import { Check, Star, Lock } from "lucide-react-native";
import { router } from "expo-router";

type Tema = "verde" | "azul" | "amarelo";

type Props = {
  titulo: string;                          // nome da lição exibido abaixo do botão
  posicao: "left" | "center" | "right";   // alinhamento horizontal na trilha
  rota: string;                            // rota para a tela de exercícios da lição
  tema?: Tema;                             // cor do botão (herda o tema do módulo)
  locked?: boolean;                        // true = lição bloqueada (cadeado)
};

// Cores dos temas: cor principal do botão e cor da "shelf" (sombra 3D)
const coresTema = {
  verde:   { main: "#8AE234", shelf: "#4E7A00" },
  azul:    { main: "#1AC8EC", shelf: "#0080A0" },
  amarelo: { main: "#FFD60A", shelf: "#9A7C00" },
};

export default function TrilhaItem({ titulo, posicao, rota, tema = "verde", locked = false }: Props) {
  const cor = coresTema[tema];

  // Converte a prop posicao para o valor de alignSelf do React Native
  const alignSelf =
    posicao === "left" ? "flex-start" : posicao === "right" ? "flex-end" : "center";

  return (
    // Container posicionado horizontalmente conforme a prop posicao
    <View style={[styles.container, { alignSelf }, locked && styles.containerLocked]}>
      <View style={styles.buttonWrapper}>

        {/* "Shelf" escura: círculo fixo abaixo que cria o efeito de profundidade 3D */}
        <View style={[styles.shelf, { backgroundColor: locked ? "#2a2a2a" : cor.shelf }]} />

        {/* Botão principal: sobe 5px ao pressionar (translateY) simulando aperto */}
        <Pressable
          style={({ pressed }) => [
            styles.circle,
            {
              backgroundColor: locked ? "#333" : cor.main,
              transform: [{ translateY: pressed && !locked ? 5 : 0 }], // animação de pressionar
            },
          ]}
          onPress={() => !locked && router.push(rota)} // navega apenas se desbloqueado
          disabled={locked}
        >
          {/* Ícone: cadeado (bloqueado) ou check (desbloqueado) */}
          {locked
            ? <Lock size={32} color="#666" strokeWidth={2.5} />
            : <Check size={38} color="#000" strokeWidth={4} />
          }
        </Pressable>

        {/* Badge de estrela no canto superior: só aparece quando desbloqueado */}
        {!locked && (
          <View style={styles.starBadge}>
            <Star size={13} color="#FFD43B" fill="#FFD43B" />
          </View>
        )}
      </View>

      {/* Nome da lição abaixo do botão */}
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
  // Opacidade reduzida para indicar que a lição está bloqueada
  containerLocked: {
    opacity: 0.5,
  },
  // Área que contém o botão e a shelf (tamanho maior que o círculo para acomodar a shelf)
  buttonWrapper: {
    width: 90,
    height: 96,
    position: "relative",
  },
  // Shelf: círculo escuro fixo na parte inferior (não se move ao pressionar)
  shelf: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  // Círculo principal clicável (fica acima da shelf)
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
  // Badge de estrela no canto superior direito do botão
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
  // Título da lição (branco quando desbloqueado)
  titulo: {
    color: "#fff",
    marginTop: 12,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 11,
    letterSpacing: 0.8,
  },
  // Título cinza escuro quando bloqueado
  tituloLocked: {
    color: "#555",
  },
});
