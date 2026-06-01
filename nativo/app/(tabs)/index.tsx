import { useCallback, useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Flame, Zap, Heart, BookOpen, Bookmark } from "lucide-react-native";
import { useFonts } from "expo-font";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import CardUnidade from "../components/cardUnidade";
import TrilhaItem from "../components/trilhaItem";
import { api, DashboardResponse, CourseDetailResponse } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useLives } from "../../context/LivesContext";

const BG = "#131f24";

type Tema = "verde" | "azul" | "amarelo";

const TEMAS: { tema: Tema; cor: string; corBanner: [string, string] }[] = [
  { tema: "verde",   cor: "#9EF01A", corBanner: ["#2a5000", "#163300"] },
  { tema: "azul",    cor: "#00AED1", corBanner: ["#003a4d", "#001b24"] },
  { tema: "amarelo", cor: "#FFD60A", corBanner: ["#4a3a00", "#2a2000"] },
];

const POSICOES: (["left" | "center" | "right", "center" | "right" | "left", "right" | "left" | "center"])[] = [
  ["left",  "center", "right"],
  ["right", "center", "left"],
  ["left",  "center", "right"],
];

type Nivel = {
  id: number;
  lessonId: string;
  titulo: string;
  tema: Tema;
  cor: string;
  corBanner: [string, string];
  icon: React.ReactNode;
  atividades: { id: number; lessonId: string; titulo: string; locked: boolean }[];
};

function mapCourseToNiveis(course: CourseDetailResponse, completedIds: Set<string>): Nivel[] {
  return course.modules.map((mod, modIndex) => {
    const temaInfo = TEMAS[modIndex % TEMAS.length];
    const firstLesson = mod.lessons[0];
    const prevModFullyCompleted =
      modIndex === 0
        ? true
        : course.modules[modIndex - 1].lessons.every(l => completedIds.has(l.id));
    return {
      id: modIndex + 1,
      lessonId: firstLesson?.id ?? '',
      titulo: mod.title,
      tema: temaInfo.tema,
      cor: temaInfo.cor,
      corBanner: temaInfo.corBanner,
      icon: <BookOpen size={26} color={temaInfo.cor} />,
      atividades: mod.lessons.map((lesson, lessonIndex) => ({
        id: lessonIndex + 1,
        lessonId: lesson.id,
        titulo: lesson.title.toUpperCase(),
        locked:
          !prevModFullyCompleted ||
          (lessonIndex > 0 && !completedIds.has(mod.lessons[lessonIndex - 1].id)),
      })),
    };
  });
}

export default function Index() {
  const { logout } = useAuth();
  const { lives, nextLifeAt } = useLives();
  const [lifeCountdown, setLifeCountdown] = useState<string | null>(null);

  useEffect(() => {
    if (!nextLifeAt) { setLifeCountdown(null); return; }
    const update = () => {
      const rem = nextLifeAt - Date.now();
      if (rem <= 0) { setLifeCountdown(null); return; }
      const m = Math.floor(rem / 60_000);
      const s = Math.floor((rem % 60_000) / 1000);
      setLifeCountdown(`${m}:${s.toString().padStart(2, '0')}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [nextLifeAt]);

  const [fontsLoaded] = useFonts({
    SpaceMono: require("../../assets/fonts/Space_Mono/SpaceMono-Regular.ttf"),
    SpaceMonoBold: require("../../assets/fonts/Space_Mono/SpaceMono-Bold.ttf"),
  });

  const [niveis, setNiveis] = useState<Nivel[]>([]);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([
        api.get<CourseDetailResponse>('/api/courses/expo-react-native').catch(() => null),
        api.get<DashboardResponse>('/api/progress/dashboard').catch(() => null),
      ]).then(([course, dash]) => {
        if (course) {
          const completedIds = new Set(dash?.passedLessonIds ?? []);
          setNiveis(mapCourseToNiveis(course, completedIds));
        }
        if (dash) setDashboard(dash);
      }).finally(() => setLoading(false));
    }, [])
  );

  if (!fontsLoaded) return null;

  const stats = dashboard?.userStats;
  const sessaoAtual = niveis[0];
  const atividadeAtual = niveis[0]?.atividades[0];

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
            <Text style={[styles.statText, { color: "#FF7A00" }]}>
              {stats?.currentStreak ?? 0}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Zap size={20} color="#FFD60A" fill="#FFD60A" />
            <Text style={[styles.statText, { color: "#FFD60A" }]}>
              {stats?.totalXp ?? 0}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Heart size={20} color="#FF4D6D" fill="#FF4D6D" />
            <Text style={[styles.statText, { color: "#FF4D6D" }]}>{lives}</Text>
            {lifeCountdown && (
              <Text style={styles.lifeCountdown}>{lifeCountdown}</Text>
            )}
          </View>
        </View>
      </View>

      {/* ── SESSÃO ATUAL ── */}
      {loading ? (
        <View style={{ padding: 40, alignItems: "center" }}>
          <ActivityIndicator color="#9EF01A" size="large" />
        </View>
      ) : sessaoAtual && atividadeAtual ? (
        <View style={styles.sessaoWrapper}>
          <LinearGradient
            colors={sessaoAtual.corBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.sessaoCard, { borderColor: sessaoAtual.cor + "55" }]}
          >
            <View style={styles.sessaoLabelRow}>
              <Bookmark size={11} color={sessaoAtual.cor} fill={sessaoAtual.cor} />
              <Text style={[styles.sessaoLabelText, { color: sessaoAtual.cor }]}>
                MÓDULO {sessaoAtual.id} · ATIVIDADE {atividadeAtual.id}
              </Text>
            </View>

            <View style={styles.sessaoContent}>
              <View style={styles.sessaoLeft}>
                <Text style={styles.sessaoTitulo}>{atividadeAtual.titulo}</Text>
                <Text style={styles.sessaoSubtitulo}>{sessaoAtual.titulo}</Text>
              </View>
              <TouchableOpacity
                style={[styles.iniciarBtn, { backgroundColor: sessaoAtual.cor }]}
                onPress={() => router.push(`/atividade/${atividadeAtual.lessonId}`)}
              >
                <Text style={styles.iniciarText}>INICIAR</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      ) : null}

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
                key={atividade.lessonId}
                titulo={atividade.titulo}
                posicao={POSICOES[nivelIndex % POSICOES.length][index % 3]}
                rota={`/atividade/${atividade.lessonId}`}
                tema={nivel.tema}
                locked={atividade.locked}
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
  scroll: { flex: 1, backgroundColor: BG },
  scrollContent: { paddingBottom: 20 },

  header: {
    paddingTop: 28, paddingHorizontal: 20, paddingBottom: 18,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderBottomWidth: 1, borderBottomColor: "#1e2f38",
  },
  logo: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: "#9EF01A",
    justifyContent: "center", alignItems: "center", marginRight: 10,
  },
  logoText: { color: "#FFF", fontSize: 26, fontWeight: "bold" },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontWeight: "bold", fontSize: 15 },
  lifeCountdown: { color: "#FF4D6D", fontSize: 11, opacity: 0.7 },

  sessaoWrapper: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 4 },
  sessaoCard: { borderRadius: 18, borderWidth: 1.5, paddingHorizontal: 18, paddingVertical: 16 },
  sessaoLabelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  sessaoLabelText: { fontSize: 11, fontWeight: "bold", letterSpacing: 1 },
  sessaoContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  sessaoLeft: { flex: 1, gap: 3 },
  sessaoTitulo: { color: "#fff", fontSize: 17, fontWeight: "bold", letterSpacing: 0.5 },
  sessaoSubtitulo: { color: "#8899a0", fontSize: 12 },
  iniciarBtn: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20 },
  iniciarText: { color: "#000", fontWeight: "bold", fontSize: 13, letterSpacing: 0.5 },

  trilhaContainer: { paddingHorizontal: 28, paddingVertical: 4 },
});
