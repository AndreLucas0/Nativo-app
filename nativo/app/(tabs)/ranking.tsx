import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

// ── Dados mockados ────────────────────────────────────────────────────────────
const MY_POSITION = 13;
const TOTAL       = 13;
const PRIZE_ZONE  = 3;   // top 3 ganham prêmio
const DROP_ZONE   = 9;   // a partir do 9 pode cair

const PLAYERS = [
  { pos: 1,  name: "ReactNinja", xp: 420, avatar: "👑", emoji: "🧑‍💻" },
  { pos: 2,  name: "ExpoQueen",  xp: 380, avatar: "2",  emoji: "👸" },
  { pos: 3,  name: "HookMaster", xp: 310, avatar: "3",  emoji: "🎧" },
  { pos: 4,  name: "MobileDev",  xp: 275, avatar: "4",  emoji: "📱" },
  { pos: 5,  name: "JSWizard",   xp: 240, avatar: "5",  emoji: "🧙" },
  { pos: 6,  name: "PixelPusher",xp: 210, avatar: "6",  emoji: "🎨" },
  { pos: 7,  name: "CodeCat",    xp: 180, avatar: "7",  emoji: "🐱" },
  { pos: 8,  name: "BugHunter",  xp: 150, avatar: "8",  emoji: "🐛" },
  { pos: 9,  name: "TurboTuro",  xp: 120, avatar: "9",  emoji: "🚀" },
  { pos: 10, name: "DebugDuck",  xp: 95,  avatar: "10", emoji: "🦆" },
  { pos: 11, name: "AsyncAna",   xp: 70,  avatar: "11", emoji: "⚡" },
  { pos: 12, name: "StateStan",  xp: 45,  avatar: "12", emoji: "🧠" },
  { pos: 13, name: "você",       xp: 0,   avatar: "13", emoji: "🧑" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getBadgeStyle(pos: number) {
  if (pos === 1) return { bg: "#FFD700", text: "👑" };
  if (pos === 2) return { bg: "#C0C0C0", text: "2" };
  if (pos === 3) return { bg: "#CD7F32", text: "3" };
  return null;
}

export default function RankingScreen() {
  return (
    <View style={styles.screen}>
      {/* ── Header app ─────────────────────────────────────────────────── */}
      <AppHeader />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Card liga atual ─────────────────────────────────────────── */}
        <View style={styles.leagueCard}>
          <Text style={styles.leagueMedal}>🥉</Text>
          <Text style={styles.leagueName}>Liga Bronze</Text>
          <Text style={styles.leagueSub}>Faltam 100 XP para subir para Prata</Text>
          <View style={styles.leagueTimer}>
            <MaterialIcons name="access-time" size={14} color="#aaa" />
            <Text style={styles.leagueTimerText}>Termina em 5 dia(s)</Text>
          </View>
        </View>

        {/* ── Sua posição ──────────────────────────────────────────────── */}
        <View style={styles.positionCard}>
          <View>
            <Text style={styles.positionLabel}>SUA POSIÇÃO</Text>
            <View style={styles.positionRow}>
              <Text style={styles.positionNumber}>#{MY_POSITION}</Text>
              <Text style={styles.positionOf}> de {TOTAL}</Text>
            </View>
          </View>
          <View style={styles.dropZoneBadge}>
            <MaterialIcons name="keyboard-arrow-down" size={16} color="#EF4444" />
            <Text style={styles.dropZoneText}>Zona de queda</Text>
          </View>
        </View>

        {/* ── Lista de jogadores ───────────────────────────────────────── */}
        <View style={styles.listContainer}>
          {PLAYERS.map((p) => {
            const isMe      = p.pos === MY_POSITION;
            const isPrize   = p.pos <= PRIZE_ZONE;
            const isDrop    = p.pos >= DROP_ZONE;
            const badge     = getBadgeStyle(p.pos);

            return (
              <View
                key={p.pos}
                style={[styles.playerRow, isMe && styles.playerRowMe]}
              >
                {/* Posição */}
                {badge ? (
                  <View style={[styles.posBadge, { backgroundColor: badge.bg }]}>
                    <Text style={styles.posBadgeText}>{badge.text}</Text>
                  </View>
                ) : (
                  <View style={styles.posCircle}>
                    <Text style={styles.posCircleText}>{p.pos}</Text>
                  </View>
                )}

                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>{p.emoji}</Text>
                </View>

                {/* Nome + status */}
                <View style={styles.playerInfo}>
                  <Text style={[styles.playerName, isMe && styles.playerNameMe]}>
                    {isMe ? "Você" : p.name}{" "}
                    {isMe && <Text style={styles.youLabel}>você</Text>}
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

                {/* XP */}
                <View style={styles.xpCol}>
                  <Text style={[styles.xpValue, isMe && styles.xpValueMe]}>
                    {p.xp}
                  </Text>
                  <Text style={styles.xpLabel}>XP</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Rodapé ──────────────────────────────────────────────────── */}
        <Text style={styles.footer}>
          Top 3 sobem de liga e ganham prêmios. Últimos 5 podem cair.
        </Text>

      </ScrollView>
    </View>
  );
}

// ── Header compartilhado ──────────────────────────────────────────────────────
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
        <StatItem icon="🔥" value={0} color="#FF6B00" />
        <StatItem icon="⚡" value={0} color="#FFD700" />
        <StatItem icon="❤️" value={5} color="#EF4444" />
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

// ── Estilos ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#111111",
  },

  // App Header
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
  logoText:    { color: "#fff", fontWeight: "800", fontSize: 16 },
  logoName:    { color: "#fff", fontWeight: "700", fontSize: 18 },
  appHeaderStats: { flexDirection: "row", gap: 14 },
  statItem:    { flexDirection: "row", alignItems: "center", gap: 4 },
  statIcon:    { fontSize: 16 },
  statValue:   { fontWeight: "700", fontSize: 14 },

  // Liga card
  leagueCard: {
    margin: 16,
    backgroundColor: "#2A1F10",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3D2B14",
  },
  leagueMedal: { fontSize: 48, marginBottom: 4 },
  leagueName:  { color: "#FFD700", fontSize: 22, fontWeight: "800", marginBottom: 4 },
  leagueSub:   { color: "#999", fontSize: 13, marginBottom: 8 },
  leagueTimer: { flexDirection: "row", alignItems: "center", gap: 4 },
  leagueTimerText: { color: "#aaa", fontSize: 13 },

  // Posição
  positionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  positionLabel:  { color: "#888", fontSize: 11, fontWeight: "700", marginBottom: 4 },
  positionRow:    { flexDirection: "row", alignItems: "baseline" },
  positionNumber: { color: "#fff", fontSize: 28, fontWeight: "800" },
  positionOf:     { color: "#888", fontSize: 16 },
  dropZoneBadge:  { flexDirection: "row", alignItems: "center", gap: 2 },
  dropZoneText:   { color: "#EF4444", fontSize: 13, fontWeight: "700" },

  // Lista
  listContainer: { paddingHorizontal: 16, gap: 4 },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 4,
  },
  playerRowMe: {
    backgroundColor: "#1A2E1A",
    borderWidth: 1,
    borderColor: "#2D4A2D",
  },

  // Badge posição
  posBadge: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: "center", alignItems: "center",
  },
  posBadgeText: { fontSize: 16 },
  posCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#2A2A2A",
    justifyContent: "center", alignItems: "center",
  },
  posCircleText: { color: "#aaa", fontSize: 14, fontWeight: "700" },

  // Avatar
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "#2A2A2A",
    justifyContent: "center", alignItems: "center",
  },
  avatarEmoji: { fontSize: 20 },

  // Info
  playerInfo: { flex: 1 },
  playerName: { color: "#fff", fontSize: 15, fontWeight: "700" },
  playerNameMe: { color: "#4CAF50" },
  youLabel:   { color: "#4CAF50", fontSize: 12, fontWeight: "600" },

  prizeTag: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  prizeTagIcon: { fontSize: 11 },
  prizeTagText: { color: "#FFD700", fontSize: 10, fontWeight: "700" },

  dropTag: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  dropTagText: { color: "#EF4444", fontSize: 10, fontWeight: "700" },

  // XP
  xpCol:      { alignItems: "flex-end" },
  xpValue:    { color: "#FFD700", fontSize: 16, fontWeight: "800" },
  xpValueMe:  { color: "#4CAF50" },
  xpLabel:    { color: "#666", fontSize: 11 },

  // Footer
  footer: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
    padding: 20,
  },
});