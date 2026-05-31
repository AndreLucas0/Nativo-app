import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Flame, Zap, Heart, BookOpen, Bookmark } from "lucide-react-native";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import CardUnidade from "../components/cardUnidade";
import TrilhaItem from "../components/trilhaItem";

const BG = "#131f24";

// Nível 2 invertido → cria efeito cobra/snake entre as seções
const posicoesPorNivel = [
  ["left",  "center", "right"] as const,   // Nível 1: →
  ["right", "center", "left"]  as const,   // Nível 2: ← (invertido)
  ["left",  "center", "right"] as const,   // Nível 3: →
];

const niveis = [
  {
    id: 1,
    titulo: "Básico - Introdução ao Expo",
    tema: "verde" as const,
    cor: "#9EF01A",
    corBanner: ["#2a5000", "#163300"] as const,
    icon: <BookOpen size={26} color="#9EF01A" />,
    atividades: [
      { id: 1, titulo: "EXPO & SETUP" },
      { id: 2, titulo: "COMPONENTES BASE" },
      { id: 3, titulo: "COMANDOS ESSENCIAIS" },
    ],
  },
  {
    id: 2,
    titulo: "Intermediário - Componentes",
    tema: "azul" as const,
    cor: "#00AED1",
    corBanner: ["#003a4d", "#001b24"] as const,
    icon: <BookOpen size={26} color="#00AED1" />,
    atividades: [
      { id: 1, titulo: "HOOKS & LAYOUT" },
      { id: 2, titulo: "INTERATIVIDADE" },
      { id: 3, titulo: "SCROLL & LISTAS" },
    ],
  },
  {
    id: 3,
    titulo: "Avançado - Performance",
    tema: "amarelo" as const,
    cor: "#FFD60A",
    corBanner: ["#4a3a00", "#2a2000"] as const,
    icon: <BookOpen size={26} color="#FFD60A" />,
    atividades: [
      { id: 1, titulo: "RENDERIZAÇÃO" },
      { id: 2, titulo: "ESTADO GLOBAL" },
      { id: 3, titulo: "BOAS PRÁTICAS" },
    ],
  },
];

// Sessão atual — futuramente vinda do progresso do usuário
const sessaoAtual = niveis[0];
const atividadeAtual = niveis[0].atividades[0];

export default function Index() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../../assets/fonts/Space_Mono/SpaceMono-Regular.ttf"),
    SpaceMonoBold: require("../../assets/fonts/Space_Mono/SpaceMono-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.logo}>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: "#000" }}>N</Text>
          </View>
          <Text style={styles.logoText}>Nativo</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Flame size={20} color="#FF7A00" />
            <Text style={[styles.statText, { color: "#FF7A00" }]}>1</Text>
          </View>
          <View style={styles.statItem}>
            <Zap size={20} color="#FFD60A" fill="#FFD60A" />
            <Text style={[styles.statText, { color: "#FFD60A" }]}>18</Text>
          </View>
          <View style={styles.statItem}>
            <Heart size={20} color="#FF4D6D" fill="#FF4D6D" />
            <Text style={[styles.statText, { color: "#FF4D6D" }]}>5</Text>
          </View>
        </View>
      </View>

      {/* ── SESSÃO ATUAL ── */}
      <View style={styles.sessaoWrapper}>
        <LinearGradient
          colors={sessaoAtual.corBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.sessaoCard, { borderColor: sessaoAtual.cor + "55" }]}
        >
          {/* Label */}
          <View style={styles.sessaoLabelRow}>
            <Bookmark size={11} color={sessaoAtual.cor} fill={sessaoAtual.cor} />
            <Text style={[styles.sessaoLabelText, { color: sessaoAtual.cor }]}>
              NÍVEL {sessaoAtual.id} · ATIVIDADE {atividadeAtual.id}
            </Text>
          </View>

          {/* Título + botão */}
          <View style={styles.sessaoContent}>
            <View style={styles.sessaoLeft}>
              <Text style={styles.sessaoTitulo}>{atividadeAtual.titulo}</Text>
              <Text style={styles.sessaoSubtitulo}>{sessaoAtual.titulo}</Text>
            </View>
            <TouchableOpacity
              style={[styles.iniciarBtn, { backgroundColor: sessaoAtual.cor }]}
              onPress={() =>
                router.push(`/atividade/${sessaoAtual.id}/${atividadeAtual.id}`)
              }
            >
              <Text style={styles.iniciarText}>INICIAR</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* ── TRILHA ── */}
      {niveis.map((nivel, nivelIndex) => (
        <View key={nivel.id}>
          <CardUnidade
            titulo={nivel.titulo}
            numero={nivel.id}
            tema={nivel.tema}
            icon={nivel.icon}
          />

          <View style={styles.trilhaContainer}>
            {nivel.atividades.map((atividade, index) => (
              <TrilhaItem
                key={atividade.id}
                titulo={atividade.titulo}
                posicao={posicoesPorNivel[nivelIndex][index]}
                rota={`/atividade/${nivel.id}/${atividade.id}`}
                tema={nivel.tema}
              />
            ))}
          </View>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header
  header: {
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1e2f38",
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#9EF01A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoText: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "bold",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontWeight: "bold",
    fontSize: 15,
  },

  // Sessão atual
  sessaoWrapper: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 4,
  },
  sessaoCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  sessaoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  sessaoLabelText: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  sessaoContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sessaoLeft: {
    flex: 1,
    gap: 3,
  },
  sessaoTitulo: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  sessaoSubtitulo: {
    color: "#8899a0",
    fontSize: 12,
  },
  iniciarBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  iniciarText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 0.5,
  },

  // Trilha
  trilhaContainer: {
    paddingHorizontal: 28,
    paddingVertical: 4,
  },
});
