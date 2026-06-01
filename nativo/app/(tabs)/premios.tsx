import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { api, DashboardResponse } from "../../services/api";
import { useLives } from "../../context/LivesContext";

const LEAGUES = [
  { name: "Liga Bronze",    emoji: "🥉", color: "#CD7F32", bg: "#2A1F10", border: "#CD7F32", reward: "10 💎 Gemas",                 xp: 0    },
  { name: "Liga Prata",     emoji: "🥈", color: "#C0C0C0", bg: "#1E1E1E", border: "#2A2A2A", reward: "25 💎 + 1 ❤️",               xp: 100  },
  { name: "Liga Ouro",      emoji: "🥇", color: "#FFD700", bg: "#1E1E1E", border: "#2A2A2A", reward: "50 💎 + 3 ❤️",               xp: 300  },
  { name: "Liga Safira",    emoji: "💠", color: "#4FC3F7", bg: "#1E1E1E", border: "#2A2A2A", reward: "100 💎 + Avatar exclusivo",   xp: 600  },
  { name: "Liga Rubi",      emoji: "♦️", color: "#EF4444", bg: "#1E1E1E", border: "#2A2A2A", reward: "200 💎 + Tema custom",        xp: 1000 },
  { name: "Liga Esmeralda", emoji: "💚", color: "#4CAF50", bg: "#1E1E1E", border: "#2A2A2A", reward: "350 💎 + Badge raro",         xp: 1500 },
  { name: "Liga Diamante",  emoji: "💎", color: "#818CF8", bg: "#1E1E1E", border: "#2A2A2A", reward: "500 💎 + Curso premium",      xp: 2500 },
  { name: "Liga Lendário",  emoji: "👑", color: "#FFD700", bg: "#1E1E1E", border: "#2A2A2A", reward: "1000 💎 + Mentoria",          xp: 4000 },
];

function getCurrentLeagueIndex(totalXp: number): number {
  let current = 0;
  for (let i = 0; i < LEAGUES.length; i++) {
    if (totalXp >= LEAGUES[i].xp) current = i;
  }
  return current;
}

export default function PremiosScreen() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      api.get<DashboardResponse>('/api/progress/dashboard')
        .then(setDashboard)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [])
  );

  const xp = dashboard?.userStats?.totalXp ?? 0;
  const currentLeagueIndex = getCurrentLeagueIndex(xp);

  const { lives } = useLives();

  return (
    <View style={styles.screen}>
      <AppHeader streak={dashboard?.userStats?.currentStreak ?? 0} xp={xp} lives={lives} loading={loading} />

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.topCard}>
          <Text style={styles.topIcon}>🎁</Text>
          <Text style={styles.topTitle}>Prêmios</Text>
          <Text style={styles.topSub}>Suba de liga e desbloqueie recompensas exclusivas</Text>
        </View>

        <View style={styles.listContainer}>
          {LEAGUES.map((league, index) => {
            const isCurrent  = index === currentLeagueIndex;
            const isUnlocked = xp >= league.xp;

            return (
              <View
                key={league.name}
                style={[
                  styles.leagueCard,
                  { backgroundColor: league.bg, borderColor: isCurrent ? "#4CAF50" : league.border },
                  isCurrent && styles.leagueCardCurrent,
                ]}
              >
                <View style={[styles.leagueIcon, { borderColor: league.color + "55" }]}>
                  <Text style={styles.leagueEmoji}>{league.emoji}</Text>
                </View>

                <View style={styles.leagueInfo}>
                  <View style={styles.leagueNameRow}>
                    <Text style={[styles.leagueName, { color: league.color }]}>{league.name}</Text>
                    {isCurrent && (
                      <View style={styles.atualBadge}>
                        <Text style={styles.atualBadgeText}>ATUAL</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.leagueReward}>{league.reward}</Text>
                  <Text style={styles.leagueXP}>
                    {league.xp === 0 ? 'Inicial' : `Requer ${league.xp} XP`}
                  </Text>
                </View>

                {isUnlocked ? (
                  <View style={styles.checkCircle}>
                    <MaterialIcons name="check" size={20} color="#4CAF50" />
                  </View>
                ) : (
                  <View style={styles.lockCircle}>
                    <MaterialIcons name="lock" size={18} color="#555" />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.footer}>💡 Complete lições para ganhar XP e subir nas ligas.</Text>
      </ScrollView>
    </View>
  );
}

function AppHeader({ streak, xp, lives, loading }: { streak: number; xp: number; lives: number; loading: boolean }) {
  return (
    <View style={styles.appHeader}>
      <View style={styles.appHeaderLogo}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>N</Text>
        </View>
        <Text style={styles.logoName}>Nativo</Text>
      </View>
      <View style={styles.appHeaderStats}>
        {loading ? (
          <ActivityIndicator color="#9EF01A" size="small" />
        ) : (
          [["🔥", streak, "#FF6B00"], ["⚡", xp, "#FFD700"], ["❤️", lives, "#EF4444"]].map(
            ([icon, val, color]) => (
              <View key={String(icon)} style={styles.statItem}>
                <Text style={styles.statIcon}>{icon}</Text>
                <Text style={[styles.statValue, { color: String(color) }]}>{val}</Text>
              </View>
            )
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#111111" },

  appHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, backgroundColor: "#1C1C1C",
  },
  appHeaderLogo: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoCircle: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: "#4CAF50",
    justifyContent: "center", alignItems: "center",
  },
  logoText:       { color: "#fff", fontWeight: "800", fontSize: 16 },
  logoName:       { color: "#fff", fontWeight: "700", fontSize: 18 },
  appHeaderStats: { flexDirection: "row", gap: 14 },
  statItem:       { flexDirection: "row", alignItems: "center", gap: 4 },
  statIcon:       { fontSize: 16 },
  statValue:      { fontWeight: "700", fontSize: 14 },

  topCard: {
    margin: 16, backgroundColor: "#1A2E1A", borderRadius: 16, padding: 24,
    alignItems: "center", borderWidth: 1, borderColor: "#2D4A2D",
  },
  topIcon:  { fontSize: 52, marginBottom: 8 },
  topTitle: { color: "#4CAF50", fontSize: 26, fontWeight: "800", marginBottom: 4 },
  topSub:   { color: "#888", fontSize: 13, textAlign: "center" },

  listContainer: { paddingHorizontal: 16, gap: 8 },
  leagueCard: {
    flexDirection: "row", alignItems: "center", borderRadius: 14,
    padding: 14, borderWidth: 1, gap: 12,
  },
  leagueCardCurrent: { borderWidth: 2 },

  leagueIcon: {
    width: 50, height: 50, borderRadius: 12, backgroundColor: "#2A2A2A",
    borderWidth: 1, justifyContent: "center", alignItems: "center",
  },
  leagueEmoji: { fontSize: 26 },

  leagueInfo:    { flex: 1 },
  leagueNameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  leagueName:    { fontSize: 16, fontWeight: "700" },
  atualBadge: {
    backgroundColor: "#4CAF50", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  atualBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  leagueReward:   { color: "#ccc", fontSize: 13, marginBottom: 2 },
  leagueXP:       { color: "#666", fontSize: 12 },

  checkCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#1A2E1A",
    borderWidth: 1.5, borderColor: "#4CAF50", justifyContent: "center", alignItems: "center",
  },
  lockCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#222",
    borderWidth: 1, borderColor: "#333", justifyContent: "center", alignItems: "center",
  },

  footer: { color: "#555", fontSize: 12, textAlign: "center", padding: 20 },
});
