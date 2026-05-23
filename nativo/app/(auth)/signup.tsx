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

export default function SignupScreen() {
  const { signUp, loading } = useAuth();

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] = useState('');

  async function handleSignup() {
    try {
      setError('');

      if (!name || !email || !password) {
        setError(
          'Preencha todos os campos.'
        );

        return;
      }

      if (password.length < 6) {
        setError(
          'A senha deve possuir no mínimo 6 caracteres.'
        );

        return;
      }

      await signUp({
        name,
        email,
        password,
      });

      router.replace('/(tabs)');
    } catch {
      setError(
        'Erro ao criar conta.'
      );
    }
  }

  function handleNavigateLogin() {
    router.push('/login' as Href);
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>
            Criar conta 🚀
          </Text>

          <Text style={styles.subtitle}>
            Comece sua jornada agora.
          </Text>
        </View>

        <View style={styles.form}>
          <DuoInput
            label="NOME"
            value={name}
            onChangeText={setName}
            placeholder="Digite seu nome"
          />

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
            title="Cadastrar"
            onPress={handleSignup}
            loading={loading}
          />

          <Pressable
            onPress={handleNavigateLogin}
          >
            <Text style={styles.link}>
              Já possui conta?{' '}
              <Text style={styles.linkBold}>
                Entrar
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