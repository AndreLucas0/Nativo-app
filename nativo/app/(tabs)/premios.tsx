import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const LEAGUES = [
  {
    name: "Liga Bronze",
    emoji: "🥉",
    color: "#CD7F32",
    bg: "#2A1F10",
    border: "#CD7F32",
    reward: "10 💎 Gemas",
    xp: 0,
    current: true,
    unlocked: true,
  },
  {
    name: "Liga Prata",
    emoji: "🥈",
    color: "#C0C0C0",
    bg: "#1E1E1E",
    border: "#2A2A2A",
    reward: "25 💎 + 1 ❤️",
    xp: 100,
    current: false,
    unlocked: false,
  },
  {
    name: "Liga Ouro",
    emoji: "🥇",
    color: "#FFD700",
    bg: "#1E1E1E",
    border: "#2A2A2A",
    reward: "50 💎 + 3 ❤️",
    xp: 300,
    current: false,
    unlocked: false,
  },
  {
    name: "Liga Safira",
    emoji: "💠",
    color: "#4FC3F7",
    bg: "#1E1E1E",
    border: "#2A2A2A",
    reward: "100 💎 + Avatar exclusivo",
    xp: 600,
    current: false,
    unlocked: false,
  },
  {
    name: "Liga Rubi",
    emoji: "♦️",
    color: "#EF4444",
    bg: "#1E1E1E",
    border: "#2A2A2A",
    reward: "200 💎 + Tema custom",
    xp: 1000,
    current: false,
    unlocked: false,
  },
  {
    name: "Liga Esmeralda",
    emoji: "💚",
    color: "#4CAF50",
    bg: "#1E1E1E",
    border: "#2A2A2A",
    reward: "350 💎 + Badge raro",
    xp: 1500,
    current: false,
    unlocked: false,
  },
  {
    name: "Liga Diamante",
    emoji: "💎",
    color: "#818CF8",
    bg: "#1E1E1E",
    border: "#2A2A2A",
    reward: "500 💎 + Curso premium",
    xp: 2500,
    current: false,
    unlocked: false,
  },
  {
    name: "Liga Lendário",
    emoji: "👑",
    color: "#FFD700",
    bg: "#1E1E1E",
    border: "#2A2A2A",
    reward: "1000 💎 + Mentoria",
    xp: 4000,
    current: false,
    unlocked: false,
  },
];

export default function PremiosScreen() {
  return (
    <View style={styles.screen}>
      {/* ── Header app ─────────────────────────────────────────────────── */}
      <AppHeader />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Card topo ────────────────────────────────────────────────── */}
        <View style={styles.topCard}>
          <Text style={styles.topIcon}>🎁</Text>
          <Text style={styles.topTitle}>Prêmios</Text>
          <Text style={styles.topSub}>Suba de liga e desbloqueie recompensas exclusivas</Text>
        </View>

        {/* ── Lista de ligas ───────────────────────────────────────────── */}
        <View style={styles.listContainer}>
          {LEAGUES.map((league) => (
            <View
              key={league.name}
              style={[
                styles.leagueCard,
                { backgroundColor: league.bg, borderColor: league.current ? "#4CAF50" : league.border },
                league.current && styles.leagueCardCurrent,
              ]}
            >
              {/* Ícone */}
              <View style={[styles.leagueIcon, { borderColor: league.color + "55" }]}>
                <Text style={styles.leagueEmoji}>{league.emoji}</Text>
              </View>

              {/* Info */}
              <View style={styles.leagueInfo}>
                <View style={styles.leagueNameRow}>
                  <Text style={[styles.leagueName, { color: league.color }]}>
                    {league.name}
                  </Text>
                  {league.current && (
                    <View style={styles.atualBadge}>
                      <Text style={styles.atualBadgeText}>ATUAL</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.leagueReward}>{league.reward}</Text>
                <Text style={styles.leagueXP}>Requer {league.xp} XP</Text>
              </View>

              {/* Status */}
              {league.unlocked ? (
                <View style={styles.checkCircle}>
                  <MaterialIcons name="check" size={20} color="#4CAF50" />
                </View>
              ) : (
                <View style={styles.lockCircle}>
                  <MaterialIcons name="lock" size={18} color="#555" />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Rodapé */}
        <Text style={styles.footer}>
          💡 Complete lições para ganhar XP e subir nas ligas.
        </Text>

      </ScrollView>
    </View>
  );
}

// ── Header compartilhado (mesmo do ranking) ───────────────────────────────────
function AppHeader() {
  return (
    <View style={styles.appHeader}>
      <View style={styles.appHeaderLogo}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>N</Text>
        </View>
        <Text style={styles.logoName}>Nativo</Text>
      </View>
      <View style={styles.appHeaderStats}>
        {[["🔥", 0, "#FF6B00"], ["⚡", 0, "#FFD700"], ["❤️", 5, "#EF4444"]].map(
          ([icon, val, color]) => (
            <View key={String(icon)} style={styles.statItem}>
              <Text style={styles.statIcon}>{icon}</Text>
              <Text style={[styles.statValue, { color: String(color) }]}>{val}</Text>
            </View>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#111111" },

  // Header
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: "#1C1C1C",
  },
  appHeaderLogo: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoCircle: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: "#4CAF50",
    justifyContent: "center", alignItems: "center",
  },
  logoText:  { color: "#fff", fontWeight: "800", fontSize: 16 },
  logoName:  { color: "#fff", fontWeight: "700", fontSize: 18 },
  appHeaderStats: { flexDirection: "row", gap: 14 },
  statItem:  { flexDirection: "row", alignItems: "center", gap: 4 },
  statIcon:  { fontSize: 16 },
  statValue: { fontWeight: "700", fontSize: 14 },

  // Top card
  topCard: {
    margin: 16,
    backgroundColor: "#1A2E1A",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2D4A2D",
  },
  topIcon:  { fontSize: 52, marginBottom: 8 },
  topTitle: { color: "#4CAF50", fontSize: 26, fontWeight: "800", marginBottom: 4 },
  topSub:   { color: "#888", fontSize: 13, textAlign: "center" },

  // Lista
  listContainer: { paddingHorizontal: 16, gap: 8 },
  leagueCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  leagueCardCurrent: {
    borderWidth: 2,
  },

  // Ícone da liga
  leagueIcon: {
    width: 50, height: 50, borderRadius: 12,
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    justifyContent: "center", alignItems: "center",
  },
  leagueEmoji: { fontSize: 26 },

  // Info
  leagueInfo: { flex: 1 },
  leagueNameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  leagueName:    { fontSize: 16, fontWeight: "700" },
  atualBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  atualBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  leagueReward:   { color: "#ccc", fontSize: 13, marginBottom: 2 },
  leagueXP:       { color: "#666", fontSize: 12 },

  // Status icons
  checkCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#1A2E1A",
    borderWidth: 1.5,
    borderColor: "#4CAF50",
    justifyContent: "center", alignItems: "center",
  },
  lockCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center", alignItems: "center",
  },

  // Footer
  footer: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
    padding: 20,
  },
});