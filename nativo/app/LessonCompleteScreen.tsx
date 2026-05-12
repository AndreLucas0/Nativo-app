// LessonCompleteScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  xpGained?: number;
  accuracy?: number;
  topic?: string;
  onContinue?: () => void;
};

export default function LessonCompleteScreen({
  xpGained = 18,
  accuracy = 100,
  topic = "React Native",
  onContinue,
}: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Trophy with glow */}
        <View style={styles.glow}>
          <View style={styles.trophyCircle}>
            <Ionicons name="trophy" size={56} color="#0a0a0a" />
          </View>
        </View>

        <Text style={styles.title}>Lição completa!</Text>
        <Text style={styles.subtitle}>
          Você está mais perto de dominar {topic} 🚀
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flash" size={22} color="#facc15" />
            <Text style={styles.statLabel}>XP GANHO</Text>
            <Text style={styles.statValue}>+{xpGained}</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="locate" size={22} color="#38bdf8" />
            <Text style={styles.statLabel}>PRECISÃO</Text>
            <Text style={styles.statValue}>{accuracy}%</Text>
          </View>
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={onContinue}
        >
          <Text style={styles.buttonText}>CONTINUAR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const GREEN = "#7ed957";
const BG = "#0a0a0a";
const CARD = "#1a1a1a";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(126,217,87,0.18)",
    shadowColor: GREEN,
    shadowOpacity: 0.8,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 28,
  },
  trophyCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: GREEN,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
    width: "100%",
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#262626",
  },
  statLabel: {
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 8,
  },
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },
  button: {
    backgroundColor: GREEN,
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: GREEN,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  buttonText: {
    color: "#0a0a0a",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 1,
  },
});


//<LessonCompleteScreen xpGained={18} accuracy={100} onContinue={() => navigation.goBack()} />