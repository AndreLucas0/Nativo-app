import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { api, DashboardResponse } from "../../services/api";
import { useLives } from "../../context/LivesContext";

// ── Constantes de liga ─────────────────────────────────────────────────────────
const PRIZE_ZONE = 3;
const DROP_ZONE  = 9;

// ── Dados mockados do ranking (endpoint não existe ainda no backend) ───────────
const PLAYERS_MOCK = [
  { pos: 1,  name: "ReactNinja", xp: 420, emoji: "🧑‍💻" },
  { pos: 2,  name: "ExpoQueen",  xp: 380, emoji: "👸" },
  { pos: 3,  name: "HookMaster", xp: 310, emoji: "🎧" },
  { pos: 4,  name: "MobileDev",  xp: 275, emoji: "📱" },
  { pos: 5,  name: "JSWizard",   xp: 240, emoji: "🧙" },
  { pos: 6,  name: "PixelPusher",xp: 210, emoji: "🎨" },
  { pos: 7,  name: "CodeCat",    xp: 180, emoji: "🐱" },
  { pos: 8,  name: "BugHunter",  xp: 150, emoji: "🐛" },
  { pos: 9,  name: "TurboTuro",  xp: 120, emoji: "🚀" },
  { pos: 10, name: "DebugDuck",  xp: 95,  emoji: "🦆" },
  { pos: 11, name: "AsyncAna",   xp: 70,  emoji: "⚡" },
  { pos: 12, name: "StateStan",  xp: 45,  emoji: "🧠" },
];

function getBadgeStyle(pos: number) {
  if (pos === 1) return { bg: "#FFD700", text: "👑" };
  if (pos === 2) return { bg: "#C0C0C0", text: "2" };
  if (pos === 3) return { bg: "#CD7F32", text: "3" };
  return null;
}

function getLeagueFromXp(xp: number) {
  if (xp >= 4000) return { name: "Liga Lendário", medal: "👑", xpNext: null, color: "#FFD700" };
  if (xp >= 2500) return { name: "Liga Diamante",  medal: "💎", xpNext: 4000, color: "#818CF8" };
  if (xp >= 1500) return { name: "Liga Esmeralda", medal: "💚", xpNext: 2500, color: "#4CAF50" };
  if (xp >= 1000) return { name: "Liga Rubi",      medal: "♦️", xpNext: 1500, color: "#EF4444" };
  if (xp >= 600)  return { name: "Liga Safira",    medal: "💠", xpNext: 1000, color: "#4FC3F7" };
  if (xp >= 300)  return { name: "Liga Ouro",      medal: "🥇", xpNext: 600,  color: "#FFD700" };
  if (xp >= 100)  return { name: "Liga Prata",     medal: "🥈", xpNext: 300,  color: "#C0C0C0" };
  return { name: "Liga Bronze", medal: "🥉", xpNext: 100, color: "#CD7F32" };
}

export default function RankingScreen() {
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

  const stats = dashboard?.userStats;
  const xp = stats?.totalXp ?? 0;
  const league = getLeagueFromXp(xp);

  // Insere o usuário real na lista mockada com base no XP
  const myPos = PLAYERS_MOCK.filter((p) => p.xp > xp).length + 1;
  const total = PLAYERS_MOCK.length + 1;
  const allPlayers = [
    ...PLAYERS_MOCK.filter((p) => p.xp > xp),
    { pos: myPos, name: 'você', xp, emoji: '🧑', isMe: true },
    ...PLAYERS_MOCK.filter((p) => p.xp <= xp).map((p) => ({
      ...p,
      pos: p.pos >= myPos ? p.pos + 1 : p.pos,
    })),
  ].map((p, i) => ({ ...p, pos: i + 1 }));

  const { lives } = useLives();

  return (
    <View style={styles.screen}>
      <AppHeader streak={stats?.currentStreak ?? 0} xp={xp} lives={lives} loading={loading} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Card liga atual ── */}
        <View style={styles.leagueCard}>
          <Text style={styles.leagueMedal}>{league.medal}</Text>
          <Text style={[styles.leagueName, { color: league.color }]}>{league.name}</Text>
          {league.xpNext ? (
            <Text style={styles.leagueSub}>Faltam {league.xpNext - xp} XP para subir</Text>
          ) : (
            <Text style={styles.leagueSub}>Você está na liga mais alta! 🏆</Text>
          )}
          <View style={styles.leagueTimer}>
            <MaterialIcons name="access-time" size={14} color="#aaa" />
            <Text style={styles.leagueTimerText}>Liga semanal</Text>
          </View>
        </View>

        {/* ── Sua posição ── */}
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

        {/* ── Lista de jogadores ── */}
        <View style={styles.listContainer}>
          {allPlayers.map((p) => {
            const isMe    = (p as any).isMe;
            const isPrize = p.pos <= PRIZE_ZONE;
            const isDrop  = p.pos >= DROP_ZONE;
            const badge   = getBadgeStyle(p.pos);

            return (
              <View key={p.pos} style={[styles.playerRow, isMe && styles.playerRowMe]}>
                {badge ? (
                  <View style={[styles.posBadge, { backgroundColor: badge.bg }]}>
                    <Text style={styles.posBadgeText}>{badge.text}</Text>
                  </View>
                ) : (
                  <View style={styles.posCircle}>
                    <Text style={styles.posCircleText}>{p.pos}</Text>
                  </View>
                )}

                <View style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>{p.emoji}</Text>
                </View>

                <View style={styles.playerInfo}>
                  <Text style={[styles.playerName, isMe && styles.playerNameMe]}>
                    {isMe ? 'Você' : p.name}
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
                  <Text style={[styles.xpValue, isMe && styles.xpValueMe]}>{p.xp}</Text>
                  <Text style={styles.xpLabel}>XP</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.footer}>Top 3 sobem de liga e ganham prêmios. Últimos 5 podem cair.</Text>
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

  appHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, backgroundColor: "#1C1C1C",
  },
  appHeaderLogo: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoCircle: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: "#4CAF50",
    justifyContent: "center", alignItems: "center",
  },
  logoText:    { color: "#fff", fontWeight: "800", fontSize: 16 },
  logoName:    { color: "#fff", fontWeight: "700", fontSize: 18 },
  appHeaderStats: { flexDirection: "row", gap: 14 },
  statItem:    { flexDirection: "row", alignItems: "center", gap: 4 },
  statIcon:    { fontSize: 16 },
  statValue:   { fontWeight: "700", fontSize: 14 },

  leagueCard: {
    margin: 16, backgroundColor: "#2A1F10", borderRadius: 16, padding: 20,
    alignItems: "center", borderWidth: 1, borderColor: "#3D2B14",
  },
  leagueMedal:    { fontSize: 48, marginBottom: 4 },
  leagueName:     { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  leagueSub:      { color: "#999", fontSize: 13, marginBottom: 8, textAlign: "center" },
  leagueTimer:    { flexDirection: "row", alignItems: "center", gap: 4 },
  leagueTimerText:{ color: "#aaa", fontSize: 13 },

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

  listContainer:  { paddingHorizontal: 16, gap: 4 },
  playerRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#1E1E1E",
    borderRadius: 12, padding: 12, gap: 10, marginBottom: 4,
  },
  playerRowMe: { backgroundColor: "#1A2E1A", borderWidth: 1, borderColor: "#2D4A2D" },

  posBadge: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  posBadgeText:  { fontSize: 16 },
  posCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#2A2A2A",
    justifyContent: "center", alignItems: "center",
  },
  posCircleText: { color: "#aaa", fontSize: 14, fontWeight: "700" },

  avatar: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: "#2A2A2A",
    justifyContent: "center", alignItems: "center",
  },
  avatarEmoji:    { fontSize: 20 },
  playerInfo:     { flex: 1 },
  playerName:     { color: "#fff", fontSize: 15, fontWeight: "700" },
  playerNameMe:   { color: "#4CAF50" },

  prizeTag: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  prizeTagIcon: { fontSize: 11 },
  prizeTagText: { color: "#FFD700", fontSize: 10, fontWeight: "700" },
  dropTag:  { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  dropTagText:  { color: "#EF4444", fontSize: 10, fontWeight: "700" },

  xpCol:     { alignItems: "flex-end" },
  xpValue:   { color: "#FFD700", fontSize: 16, fontWeight: "800" },
  xpValueMe: { color: "#4CAF50" },
  xpLabel:   { color: "#666", fontSize: 11 },

  footer: { color: "#555", fontSize: 12, textAlign: "center", padding: 20 },
});
