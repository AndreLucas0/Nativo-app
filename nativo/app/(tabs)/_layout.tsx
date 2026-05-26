import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { House } from 'lucide-react-native';
import { Crown } from 'lucide-react-native';
import { Medal } from 'lucide-react-native'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#35f600",   // verde
        tabBarInactiveTintColor: "#888",    // cinza (ou branco se quiser)
      }}
    >

      <Tabs.Screen name="index" options={{ title: "Aprender", headerShown: false, tabBarIcon: ({ color }) => <House size={24} color={color} /> }} />
      <Tabs.Screen name="ranking" options={{ title: "Ranking", headerShown: false, tabBarIcon: ({ color }) => <Crown size={24} color={color} /> }} />
      <Tabs.Screen name="premios" options={{ title: "Prêmios", headerShown: false, tabBarIcon: ({ color }) => <Medal size={24} color={color} /> }} />

    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000', // Fundo preto
    borderTopWidth: 4,
    borderColor: '#35f600', // Borda verd
    height: 75,
    paddingTop: 5,
    paddingBottom: 12,

  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  tabItem: {
    paddingTop: 5,
  },
  indicator: {
    position: 'absolute',
    top: -8, // Cola no topo da tab bar
    width: 25,
    height: 3,
    backgroundColor: '#CE0000', // Vermelho da linha indicadora
    borderRadius: 2,
  }
});
