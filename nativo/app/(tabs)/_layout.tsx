// ARQUIVO: app/(tabs)/_layout.tsx
// Define a barra de abas inferior (Tab Bar) com as 4 telas principais.
// Cada aba tem um ícone, um título e aponta para uma tela da pasta (tabs)/.

import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { House } from 'lucide-react-native';
import { Crown } from 'lucide-react-native';
import { Medal } from 'lucide-react-native';
import { User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    // Tabs do Expo Router: cria automaticamente a navegação entre abas
    <Tabs
      screenOptions={{
        headerShown: false,             // oculta o header nativo em todas as abas
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#35f600",  // cor do ícone/texto da aba selecionada
        tabBarInactiveTintColor: "#888",   // cor das abas não selecionadas
      }}
    >
      {/* Aba 1: Tela principal de aprendizado (app/(tabs)/index.tsx) */}
      <Tabs.Screen name="index"   options={{ title: "Aprender", headerShown: false, tabBarIcon: ({ color }) => <House size={24} color={color} /> }} />

      {/* Aba 2: Ranking global de usuários (app/(tabs)/ranking.tsx) */}
      <Tabs.Screen name="ranking" options={{ title: "Ranking",  headerShown: false, tabBarIcon: ({ color }) => <Crown size={24} color={color} /> }} />

      {/* Aba 3: Prêmios e ligas (app/(tabs)/premios.tsx) */}
      <Tabs.Screen name="premios" options={{ title: "Prêmios",  headerShown: false, tabBarIcon: ({ color }) => <Medal size={24} color={color} /> }} />

      {/* Aba 4: Perfil do usuário (app/(tabs)/questao.tsx → na prática perfil.tsx) */}
      <Tabs.Screen name="questao" options={{ title: "Perfil",   headerShown: false, tabBarIcon: ({ color }) => <User  size={24} color={color} /> }} />
    </Tabs>
  );
}

// Estilos da barra de abas inferior
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000', // fundo preto
    borderTopWidth: 4,
    borderColor: '#35f600',  // borda verde no topo da tab bar
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
    top: -8,
    width: 25,
    height: 3,
    backgroundColor: '#CE0000',
    borderRadius: 2,
  }
});
