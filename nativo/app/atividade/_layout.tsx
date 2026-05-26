import { Stack } from 'expo-router';

export default function AtividadeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }} />
  );
}
