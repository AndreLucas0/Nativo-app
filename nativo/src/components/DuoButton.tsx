import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { theme } from '@/src/theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function DuoButton({
  title,
  onPress,
  loading,
  disabled,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.primaryForeground} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },

  pressed: {
    opacity: 0.9,
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    ...theme.typography.button,
  },
});