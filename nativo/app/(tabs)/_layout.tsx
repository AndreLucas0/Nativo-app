import { Tabs } from "expo-router";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1C1C1C",
          borderTopColor: "#2A2A2A",
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "APRENDER",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: "RANKING",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="emoji-events" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="premios"
        options={{
          title: "PRÊMIOS",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="gift-outline" size={24} color={color} />
          ),
        }}
      />
      {/* esconde questao da tab bar */}
      <Tabs.Screen
        name="questao"
        options={{ href: null }}
      />
    </Tabs>
  );
}