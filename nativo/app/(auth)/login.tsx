import { Href, router } from 'expo-router';

import { useState } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DuoButton } from '@/src/components/DuoButton';
import { DuoInput } from '@/src/components/DuoInput';
import { ScreenContainer } from '@/src/components/ScreenContainer';

import { useAuth } from '@/src/hooks/useAuth';

import { theme } from '@/src/theme';

export default function LoginScreen() {
  const { signIn, loading } = useAuth();

  const [email, setEmail] = useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] = useState('');

  async function handleLogin() {
    try {
      setError('');

      if (!email || !password) {
        setError(
          'Preencha email e senha.'
        );

        return;
      }

      await signIn({
        email,
        password,
      });

      router.replace('/(tabs)');
    } catch {
      setError(
        'Email ou senha inválidos.'
      );
    }
  }

  function handleNavigateSignup() {
    router.push('/signup' as Href);
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>
            Bem-vindo de volta 👋
          </Text>

          <Text style={styles.subtitle}>
            Continue aprendendo Expo e AWS.
          </Text>
        </View>

        <View style={styles.form}>
          <DuoInput
            label="EMAIL"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <DuoInput
            label="SENHA"
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            secureTextEntry
          />

          {!!error && (
            <Text style={styles.error}>
              {error}
            </Text>
          )}

          <DuoButton
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
          />

          <Pressable
            onPress={handleNavigateSignup}
          >
            <Text style={styles.link}>
              Não possui conta?{' '}
              <Text style={styles.linkBold}>
                Criar conta
              </Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    ...theme.typography.title,
  },

  subtitle: {
    ...theme.typography.body,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xxxl,
  },

  form: {
    width: '100%',
  },

  error: {
    color: theme.colors.destructive,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },

  link: {
    marginTop: theme.spacing.xl,
    textAlign: 'center',
    color: theme.colors.mutedForeground,
  },

  linkBold: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});