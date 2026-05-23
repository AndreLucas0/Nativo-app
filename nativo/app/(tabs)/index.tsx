import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/src/components/ScreenContainer';
import { useAuth } from '@/src/hooks/useAuth';
import { theme } from '@/src/theme';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.greeting}>
          Olá, {user?.name || 'Aluno'} 👋
        </Text>

        <Text style={styles.title}>
          Aprenda Expo & AWS jogando
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nível {user?.level || 1}</Text>

          <Text style={styles.cardText}>
            Continue evoluindo e ganhando XP.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.xxxl,
  },

  greeting: {
    ...theme.typography.body,
    color: theme.colors.mutedForeground,
  },

  title: {
    ...theme.typography.title,
    marginTop: theme.spacing.sm,
  },

  card: {
    marginTop: theme.spacing.xxxl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  cardTitle: {
    ...theme.typography.headline,
  },

  cardText: {
    ...theme.typography.body,
    marginTop: theme.spacing.sm,
    color: theme.colors.mutedForeground,
  },
});