import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { theme } from '@/src/theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export function DuoInput({ label, error, ...rest }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        placeholderTextColor={theme.colors.mutedForeground}
        style={[styles.input, error && styles.errorInput]}
        {...rest}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },

  label: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.sm,
  },

  input: {
    height: 56,
    borderRadius: theme.radii.xxl,
    backgroundColor: theme.colors.input,
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    color: theme.colors.foreground,
  },

  errorInput: {
    borderColor: theme.colors.destructive,
  },

  error: {
    marginTop: theme.spacing.sm,
    color: theme.colors.destructive,
  },
});