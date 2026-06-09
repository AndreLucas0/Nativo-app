// ARQUIVO: app/_layout.tsx
// Ponto de entrada da aplicação. Envolve tudo com os Providers de autenticação
// e vidas, e faz o redirecionamento automático entre login e abas principais.

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { router, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { LivesProvider } from '../context/LivesContext';

// Componente que controla para qual tela o usuário é redirecionado
// dependendo se está autenticado ou não
function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments(); // segmentos da rota atual (ex: ['login'] ou ['(tabs)'])

  // Redirecionamento automático: se não autenticado → login; se autenticado → abas
  useEffect(() => {
    if (isLoading) return; // aguarda carregar o estado de autenticação

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login'); // usuário não logado → vai para login
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)'); // usuário já logado → vai para as abas
    }
  }, [isAuthenticated, isLoading, segments]);

  // Exibe spinner enquanto verifica se o usuário está autenticado
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#131f24', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#9EF01A" size="large" />
      </View>
    );
  }

  // Declara as rotas principais do app (sem header nativo)
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="atividade" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

// Layout raiz: envolve o app com AuthProvider (gerencia login/logout)
// e LivesProvider (gerencia o sistema de vidas)
export default function RootLayout() {
  return (
    <AuthProvider>
      <LivesProvider>
        <RootNavigator />
      </LivesProvider>
    </AuthProvider>
  );
}
