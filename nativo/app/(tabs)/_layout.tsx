import { Tabs } from 'expo-router';

import {
  House,
  Medal,
  Trophy,
  User,
} from 'lucide-react-native';

import { theme } from '@/src/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },

        tabBarActiveTintColor:
          theme.colors.primary,

        tabBarInactiveTintColor:
          theme.colors.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',

          tabBarIcon: ({ color }) => (
            <House color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',

          tabBarIcon: ({ color }) => (
            <Trophy color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="premios"
        options={{
          title: 'Prêmios',

          tabBarIcon: ({ color }) => (
            <Medal color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',

          tabBarIcon: ({ color }) => (
            <User color={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}