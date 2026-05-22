import { router } from 'expo-router';
      await signIn({
        email,
        password,
      });

      router.replace('/(tabs)');
    } catch {
      setError('Email ou senha inválidos');
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo de volta</Text>

        <Text style={styles.subtitle}>
          Continue sua jornada 🚀
        </Text>

        <View style={styles.form}>
          <DuoInput
            label="EMAIL"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <DuoInput
            label="SENHA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <DuoButton
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
          />
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
  },
});