import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';

import { ScreenContainer } from '@/src/components/ScreenContainer';
import { DuoButton } from '@/src/components/DuoButton';

import { useAuth } from '@/src/hooks/useAuth';

import { theme } from '@/src/theme';

export default function PerfilScreen() {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();

            router.replace('/login');
          },
        },
      ]
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.name || 'Usuário'}
        </Text>

        <Text style={styles.email}>
          {user?.email || 'email@exemplo.com'}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {user?.level || 1}
            </Text>

            <Text style={styles.statLabel}>
              Nível
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {user?.xp || 0}
            </Text>

            <Text style={styles.statLabel}>
              XP
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {user?.streak || 0}
            </Text>

            <Text style={styles.statLabel}>
              Streak
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <DuoButton
            title="Sair da conta"
            onPress={handleLogout}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: theme.spacing.giant,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 999,

    backgroundColor: theme.colors.primary,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: theme.spacing.xl,
  },

  avatarText: {
    fontSize: 42,
    fontWeight: '900',
    color: theme.colors.primaryForeground,
  },

  name: {
    ...theme.typography.title,
  },

  email: {
    ...theme.typography.body,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing.sm,
  },

  statsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },

  statCard: {
    flex: 1,

    backgroundColor: theme.colors.card,

    borderRadius: theme.radii.xl,

    padding: theme.spacing.xl,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  statValue: {
    ...theme.typography.headline,
    color: theme.colors.primary,
  },

  statLabel: {
    ...theme.typography.caption,
    marginTop: theme.spacing.sm,
  },

  actions: {
    width: '100%',
    marginTop: theme.spacing.giant,
  },
});