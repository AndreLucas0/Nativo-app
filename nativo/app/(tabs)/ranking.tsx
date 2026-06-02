import { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { api, DashboardResponse, RankingEntry } from "../../services/api";
import { useLives } from "../../context/LivesContext";

const PRIZE_ZONE = 3;
const DROP_ZONE  = 9;

function getBadgeStyle(pos: number) {
  if (pos === 1) return { bg: "#FFD700", text: "👑" };
  if (pos === 2) return { bg: "#C0C0C0", text: "2" };
  if (pos === 3) return { bg: "#CD7F32", text: "3" };
  return null;
}

function getLeagueFromXp(xp: number) {
  if (xp >= 4000) return { name: "Liga Lendário", medal: "👑", xpNext: null,  color: "#FFD700" };
  if (xp >= 2500) return { name: "Liga Diamante",  medal: "💎", xpNext: 4000, color: "#818CF8" };
  if (xp >= 1500) return { name: "Liga Esmeralda", medal: "💚", xpNext: 2500, color: "#4CAF50" };
  if (xp >= 1000) return { name: "Liga Rubi",      medal: "♦️", xpNext: 1500, color: "#EF4444" };
  if (xp >= 600)  return { name: "Liga Safira",    medal: "💠", xpNext: 1000, color: "#4FC3F7" };
  if (xp >= 300)  return { name: "Liga Ouro",      medal: "🥇", xpNext: 600,  color: "#FFD700" };
  if (xp >= 100)  return { name: "Liga Prata",     medal: "🥈", xpNext: 300,  color: "#C0C0C0" };
  return           { name: "Liga Bronze",           medal: "🥉", xpNext: 100,  color: "#CD7F32" };
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function RankingScreen() {
  const [players, setPlayers]     = useState<RankingEntry[]>([]);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading]     = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { lives } = useLives();

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setLoadError(false);
      Promise.all([
        api.get<RankingEntry[]>("/api/users/ranking"),
        api.get<DashboardResponse>("/api/progress/dashboard"),
      ])
        .then(([ranking, dash]) => {
          setPlayers(ranking);
          setDashboard(dash);
        })
        .catch(() => setLoadError(true))
        .finally(() => setLoading(false));
    }, [])
  );

  const me     = players.find((p) => p.isCurrentUser);
  const myXp   = me?.totalXp ?? dashboard?.userStats?.totalXp ?? 0;
  const myStreak = me?.currentStreak ?? dashboard?.userStats?.currentStreak ?? 0;
  const myPos  = me?.position ?? 0;
  const total  = players.length;
  const league = getLeagueFromXp(myXp);

  return (
    <View style={styles.screen}>
      <AppHeader streak={myStreak} xp={myXp} lives={lives} loading={loading} />

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator color="#4CAF50" size="large" />
        </View>
      )}

      {!loading && loadError && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>⚠️ Não foi possível carregar o ranking.</Text>
        </View>
      )}

      {!loading && !loadError && (
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ── Card liga atual ── */}
          <View style={styles.leagueCard}>
            <Text style={styles.leagueMedal}>{league.medal}</Text>
            <Text style={[styles.leagueName, { color: league.color }]}>{league.name}</Text>
            {league.xpNext ? (
              <Text style={styles.leagueSub}>Faltam {league.xpNext - myXp} XP para subir</Text>
            ) : (
              <Text style={styles.leagueSub}>Você está na liga mais alta! 🏆</Text>
            )}
            <View style={styles.leagueTimer}>
              <MaterialIcons name="access-time" size={14} color="#aaa" />
              <Text style={styles.leagueTimerText}>Liga semanal</Text>
            </View>
          </View>

          {/* ── Sua posição ── */}
          {myPos > 0 && (
            <View style={styles.positionCard}>
              <View>
                <Text style={styles.positionLabel}>SUA POSIÇÃO</Text>
                <View style={styles.positionRow}>
                  <Text style={styles.positionNumber}>#{myPos}</Text>
                  <Text style={styles.positionOf}> de {total}</Text>
                </View>
              </View>
              {myPos >= DROP_ZONE && (
                <View style={styles.dropZoneBadge}>
                  <MaterialIcons name="keyboard-arrow-down" size={16} color="#EF4444" />
                  <Text style={styles.dropZoneText}>Zona de queda</Text>
                </View>
              )}
            </View>
          )}

          {/* ── Lista de jogadores ── */}
          <View style={styles.listContainer}>
            {players.map((p) => {
              const isPrize = p.position <= PRIZE_ZONE;
              const isDrop  = p.position >= DROP_ZONE;
              const badge   = getBadgeStyle(p.position);

              return (
                <View
                  key={p.userId}
                  style={[styles.playerRow, p.isCurrentUser && styles.playerRowMe]}
                >
                  {badge ? (
                    <View style={[styles.posBadge, { backgroundColor: badge.bg }]}>
                      <Text style={styles.posBadgeText}>{badge.text}</Text>
                    </View>
                  ) : (
                    <View style={styles.posCircle}>
                      <Text style={styles.posCircleText}>{p.position}</Text>
                    </View>
                  )}

                  {p.profileImageUrl ? (
                    <Image source={{ uri: p.profileImageUrl }} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarInitials}>{getInitials(p.name)}</Text>
                    </View>
                  )}

                  <View style={styles.playerInfo}>
                    <Text style={[styles.playerName, p.isCurrentUser && styles.playerNameMe]}>
                      {p.isCurrentUser ? "Você" : p.name}
                    </Text>
                    {isPrize && (
                      <View style={styles.prizeTag}>
                        <Text style={styles.prizeTagIcon}>🏆</Text>
                        <Text style={styles.prizeTagText}>GANHA PRÊMIO</Text>
                      </View>
                    )}
                    {isDrop && !isPrize && (
                      <View style={styles.dropTag}>
                        <MaterialIcons name="warning" size={11} color="#EF4444" />
                        <Text style={styles.dropTagText}>PODE CAIR DE LIGA</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.xpCol}>
                    <Text style={[styles.xpValue, p.isCurrentUser && styles.xpValueMe]}>
                      {p.totalXp}
                    </Text>
                    <Text style={styles.xpLabel}>XP</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <Text style={styles.footer}>
            Top 3 sobem de liga e ganham prêmios. Últimos 5 podem cair.
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

function AppHeader({
  streak, xp, lives, loading,
}: {
  streak: number; xp: number; lives: number; loading: boolean;
}) {
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
          <>
            <StatItem icon="🔥" value={streak} color="#FF6B00" />
            <StatItem icon="⚡" value={xp}     color="#FFD700" />
            <StatItem icon="❤️" value={lives}  color="#EF4444" />
          </>
        )}
      </View>
    </View>
  );
}

function StatItem({ icon, value, color }: { icon: string; value: number; color: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#111111" },

  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#aaa", fontSize: 15 },

  appHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, backgroundColor: "#1C1C1C",
  },
  appHeaderLogo: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoCircle: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: "#4CAF50",
    justifyContent: "center", alignItems: "center",
  },
  logoText:         { color: "#fff", fontWeight: "800", fontSize: 16 },
  logoName:         { color: "#fff", fontWeight: "700", fontSize: 18 },
  appHeaderStats:   { flexDirection: "row", gap: 14 },
  statItem:         { flexDirection: "row", alignItems: "center", gap: 4 },
  statIcon:         { fontSize: 16 },
  statValue:        { fontWeight: "700", fontSize: 14 },

  leagueCard: {
    margin: 16, backgroundColor: "#2A1F10", borderRadius: 16, padding: 20,
    alignItems: "center", borderWidth: 1, borderColor: "#3D2B14",
  },
  leagueMedal:     { fontSize: 48, marginBottom: 4 },
  leagueName:      { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  leagueSub:       { color: "#999", fontSize: 13, marginBottom: 8, textAlign: "center" },
  leagueTimer:     { flexDirection: "row", alignItems: "center", gap: 4 },
  leagueTimerText: { color: "#aaa", fontSize: 13 },

  positionCard: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: "#1E1E1E",
    borderRadius: 12, padding: 16, flexDirection: "row",
    justifyContent: "space-between", alignItems: "center",
  },
  positionLabel:  { color: "#888", fontSize: 11, fontWeight: "700", marginBottom: 4 },
  positionRow:    { flexDirection: "row", alignItems: "baseline" },
  positionNumber: { color: "#fff", fontSize: 28, fontWeight: "800" },
  positionOf:     { color: "#888", fontSize: 16 },
  dropZoneBadge:  { flexDirection: "row", alignItems: "center", gap: 2 },
  dropZoneText:   { color: "#EF4444", fontSize: 13, fontWeight: "700" },

  listContainer: { paddingHorizontal: 16, gap: 4 },
  playerRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#1E1E1E",
    borderRadius: 12, padding: 12, gap: 10, marginBottom: 4,
  },
  playerRowMe: { backgroundColor: "#1A2E1A", borderWidth: 1, borderColor: "#2D4A2D" },

  posBadge: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: "center", alignItems: "center",
  },
  posBadgeText:  { fontSize: 16 },
  posCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#2A2A2A",
    justifyContent: "center", alignItems: "center",
  },
  posCircleText: { color: "#aaa", fontSize: 14, fontWeight: "700" },

  avatarImage: {
    width: 38, height: 38, borderRadius: 19,
  },
  avatarCircle: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: "#2D4A2D",
    justifyContent: "center", alignItems: "center",
  },
  avatarInitials: { color: "#4CAF50", fontSize: 14, fontWeight: "700" },

  playerInfo:    { flex: 1 },
  playerName:    { color: "#fff", fontSize: 15, fontWeight: "700" },
  playerNameMe:  { color: "#4CAF50" },

  prizeTag:     { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  prizeTagIcon: { fontSize: 11 },
  prizeTagText: { color: "#FFD700", fontSize: 10, fontWeight: "700" },
  dropTag:      { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  dropTagText:  { color: "#EF4444", fontSize: 10, fontWeight: "700" },

  xpCol:     { alignItems: "flex-end" },
  xpValue:   { color: "#FFD700", fontSize: 16, fontWeight: "800" },
  xpValueMe: { color: "#4CAF50" },
  xpLabel:   { color: "#666", fontSize: 11 },

  footer: { color: "#555", fontSize: 12, textAlign: "center", padding: 20 },
});
