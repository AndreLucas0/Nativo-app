import { useCallback, useState } from "react";
import {
  ScrollView, StyleSheet, Text, View, ActivityIndicator,
  TouchableOpacity, Modal, TextInput, Alert, Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { api, UserProfileResponse, ApiError } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useLives } from "../../context/LivesContext";

const PRIMARY = "#4CAF50";
const BG = "#111111";
const CARD_BG = "#1E1E1E";
const HEADER_BG = "#1C1C1C";

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function PerfilScreen() {
  const { logout } = useAuth();
  const { lives } = useLives();

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [pwVisible, setPwVisible] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setLoadError(false);
      api
        .get<UserProfileResponse>("/api/users/me")
        .then(setProfile)
        .catch(() => setLoadError(true))
        .finally(() => setLoading(false));
    }, [])
  );

  function openEdit() {
    if (!profile) return;
    setEditName(profile.name);
    setEditImageUrl(profile.profileImageUrl ?? "");
    setEditError(null);
    setEditVisible(true);
  }

  async function saveProfile() {
    if (!editName.trim() || editName.trim().length < 2) {
      setEditError("Nome deve ter pelo menos 2 caracteres.");
      return;
    }
    setEditSaving(true);
    setEditError(null);
    try {
      const body: { name: string; profileImageUrl?: string } = {
        name: editName.trim(),
      };
      if (editImageUrl.trim()) body.profileImageUrl = editImageUrl.trim();
      const updated = await api.put<UserProfileResponse>("/api/users/me", body);
      setProfile(updated);
      setEditVisible(false);
    } catch (e) {
      setEditError(
        e instanceof ApiError ? e.message : "Erro ao salvar perfil."
      );
    } finally {
      setEditSaving(false);
    }
  }

  function openChangePw() {
    setCurrentPw("");
    setNewPw("");
    setPwError(null);
    setPwVisible(true);
  }

  async function savePassword() {
    if (!currentPw) {
      setPwError("Informe a senha atual.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("Nova senha deve ter no mínimo 8 caracteres.");
      return;
    }
    setPwSaving(true);
    setPwError(null);
    try {
      await api.put<void>("/api/users/me/password", {
        currentPassword: currentPw,
        newPassword: newPw,
      });
      setPwVisible(false);
      Alert.alert("Senha alterada", "Sua senha foi alterada com sucesso.");
    } catch (e) {
      setPwError(
        e instanceof ApiError ? e.message : "Erro ao alterar senha."
      );
    } finally {
      setPwSaving(false);
    }
  }

  const xp = profile?.totalXp ?? 0;
  const streak = profile?.currentStreak ?? 0;

  return (
    <View style={styles.screen}>
      <AppHeader streak={streak} xp={xp} lives={lives} loading={loading} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={PRIMARY} size="large" />
          </View>
        ) : loadError ? (
          <View style={styles.centered}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorMsg}>Não foi possível carregar o perfil.</Text>
          </View>
        ) : (
          <>
            {/* ── Identidade ── */}
            <View style={styles.identityCard}>
              {profile?.profileImageUrl ? (
                <Image
                  source={{ uri: profile.profileImageUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitials}>
                    {profile ? getInitials(profile.name) : "?"}
                  </Text>
                </View>
              )}
              <Text style={styles.profileName}>{profile?.name ?? "—"}</Text>
              <Text style={styles.profileEmail}>{profile?.email ?? "—"}</Text>
            </View>

            {/* ── Grid de estatísticas ── */}
            <View style={styles.statsGrid}>
              <StatCard label="XP Total"  value={String(xp)}  icon="⚡" color="#FFD700" />
              <StatCard label="Nível"     value={String(profile?.currentLevel ?? 0)} icon="🏆" color={PRIMARY} />
              <StatCard label="Streak"    value={`${streak}d`} icon="🔥" color="#FF6B00" />
              <StatCard label="Recorde"   value={`${profile?.longestStreak ?? 0}d`} icon="📈" color="#818CF8" />
            </View>

            {/* ── Ações ── */}
            <View style={styles.actionsSection}>
              <Text style={styles.sectionLabel}>CONTA</Text>

              <ActionRow icon="edit"   label="Editar perfil"  onPress={openEdit} />
              <ActionRow icon="lock"   label="Alterar senha"  onPress={openChangePw} />
              <ActionRow icon="logout" label="Sair"           onPress={logout} danger />
            </View>
          </>
        )}

      </ScrollView>

      {/* ── Modal: editar perfil ── */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Seu nome"
              placeholderTextColor="#555"
              maxLength={100}
              autoFocus
            />

            <Text style={styles.inputLabel}>URL da foto (opcional)</Text>
            <TextInput
              style={styles.input}
              value={editImageUrl}
              onChangeText={setEditImageUrl}
              placeholder="https://..."
              placeholderTextColor="#555"
              autoCapitalize="none"
              keyboardType="url"
            />

            {editError ? (
              <Text style={styles.errorText}>{editError}</Text>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditVisible(false)}
                disabled={editSaving}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, editSaving && styles.btnDisabled]}
                onPress={saveProfile}
                disabled={editSaving}
              >
                {editSaving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Modal: alterar senha ── */}
      <Modal visible={pwVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>

            <Text style={styles.inputLabel}>Senha atual</Text>
            <TextInput
              style={styles.input}
              value={currentPw}
              onChangeText={setCurrentPw}
              placeholder="••••••••"
              placeholderTextColor="#555"
              secureTextEntry
              autoFocus
            />

            <Text style={styles.inputLabel}>Nova senha</Text>
            <TextInput
              style={styles.input}
              value={newPw}
              onChangeText={setNewPw}
              placeholder="Mínimo 8 caracteres"
              placeholderTextColor="#555"
              secureTextEntry
            />

            {pwError ? (
              <Text style={styles.errorText}>{pwError}</Text>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setPwVisible(false)}
                disabled={pwSaving}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, pwSaving && styles.btnDisabled]}
                onPress={savePassword}
                disabled={pwSaving}
              >
                {pwSaving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

function StatCard({
  label, value, icon, color,
}: {
  label: string; value: string; icon: string; color: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statCardIcon}>{icon}</Text>
      <Text style={[styles.statCardValue, { color }]}>{value}</Text>
      <Text style={styles.statCardLabel}>{label}</Text>
    </View>
  );
}

function ActionRow({
  icon, label, onPress, danger,
}: {
  icon: string; label: string; onPress: () => void; danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.actionIcon, danger && styles.actionIconDanger]}>
        <MaterialIcons name={icon as any} size={20} color={danger ? "#EF4444" : PRIMARY} />
      </View>
      <Text style={[styles.actionLabel, danger && styles.actionLabelDanger]}>
        {label}
      </Text>
      <MaterialIcons name="chevron-right" size={20} color="#555" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },

  appHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, backgroundColor: HEADER_BG,
  },
  appHeaderLogo: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoCircle: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: PRIMARY,
    justifyContent: "center", alignItems: "center",
  },
  logoText:       { color: "#fff", fontWeight: "800", fontSize: 16 },
  logoName:       { color: "#fff", fontWeight: "700", fontSize: 18 },
  appHeaderStats: { flexDirection: "row", gap: 14 },
  statItem:       { flexDirection: "row", alignItems: "center", gap: 4 },
  statIcon:       { fontSize: 16 },
  statValue:      { fontWeight: "700", fontSize: 14 },

  centered: { padding: 60, alignItems: "center" },
  errorEmoji: { fontSize: 48, marginBottom: 12 },
  errorMsg:   { color: "#888", fontSize: 14, textAlign: "center" },

  identityCard: {
    margin: 16, backgroundColor: "#1A2E1A", borderRadius: 18,
    padding: 24, alignItems: "center", borderWidth: 1, borderColor: "#2D4A2D",
  },
  avatarCircle: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: PRIMARY,
    justifyContent: "center", alignItems: "center", marginBottom: 14,
  },
  avatarImage:    { width: 88, height: 88, borderRadius: 44, marginBottom: 14 },
  avatarInitials: { color: "#fff", fontSize: 34, fontWeight: "800" },
  profileName:    { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 4 },
  profileEmail:   { color: "#888", fontSize: 13 },

  statsGrid: {
    flexDirection: "row", flexWrap: "wrap",
    marginHorizontal: 16, gap: 10, marginBottom: 6,
  },
  statCard: {
    flex: 1, minWidth: "45%", backgroundColor: CARD_BG, borderRadius: 14,
    padding: 16, alignItems: "center", gap: 4, borderWidth: 1, borderColor: "#2A2A2A",
  },
  statCardIcon:  { fontSize: 26, marginBottom: 2 },
  statCardValue: { fontSize: 22, fontWeight: "800" },
  statCardLabel: { color: "#888", fontSize: 12 },

  actionsSection: { marginHorizontal: 16, marginTop: 16, marginBottom: 40 },
  sectionLabel:   { color: "#555", fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },

  actionRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: CARD_BG,
    borderRadius: 12, padding: 14, marginBottom: 6, gap: 12,
  },
  actionIcon: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: "#1A2E1A",
    justifyContent: "center", alignItems: "center",
  },
  actionIconDanger: { backgroundColor: "#2E1A1A" },
  actionLabel:      { flex: 1, color: "#fff", fontSize: 15, fontWeight: "600" },
  actionLabelDanger:{ color: "#EF4444" },

  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#1C1C1C", borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  modalTitle:   { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 20 },
  inputLabel:   { color: "#888", fontSize: 12, fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: "#2A2A2A", color: "#fff", borderRadius: 12,
    padding: 14, fontSize: 15, marginBottom: 14,
    borderWidth: 1, borderColor: "#3A3A3A",
  },
  errorText: { color: "#EF4444", fontSize: 13, marginBottom: 12 },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: "#3A3A3A", alignItems: "center",
  },
  cancelBtnText: { color: "#888", fontWeight: "700", fontSize: 15 },
  saveBtn: {
    flex: 1, borderRadius: 12, padding: 14,
    backgroundColor: PRIMARY, alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  btnDisabled: { opacity: 0.6 },
});
