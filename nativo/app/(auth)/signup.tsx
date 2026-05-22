import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DuoButton } from '@/src/components/DuoButton';
import { DuoInput } from '@/src/components/DuoInput';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import { useAuth } from '@/src/hooks/useAuth';
import { theme } from '@/src/theme';

export default function SignupScreen() {
  const { signUp, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignup() {
    await signUp({
      name,
      email,
      password,
    });

    router.replace('/(tabs)');
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Criar conta</Text>

        <Text style={styles.subtitle}>
          Comece sua jornada agora 🚀
        </Text>

        <DuoInput
          label="NOME"
          value={name}
          onChangeText={setName}
        />

        <DuoInput
          label="EMAIL"
          value={email}
          onChangeText={setEmail}
        />

        <DuoInput
          label="SENHA"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <DuoButton
          title="Cadastrar"
          onPress={handleSignup}
          loading={loading}
        />
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
    marginBottom: theme.spacing.xxxl,
    marginTop: theme.spacing.sm,
  },
});