// ARQUIVO: app/atividade/_layout.tsx
// Layout do grupo de rotas de atividade (Stack Navigator).
// Define que as telas deste grupo entram com animação de slide vindo de baixo
// e que o header nativo está oculto (cada tela tem seu próprio header customizado).

import { Stack } from 'expo-router';

export default function AtividadeLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,           // header nativo desabilitado (telas têm header próprio)
      animation: 'slide_from_bottom', // animação de entrada: desliza de baixo para cima
    }} />
  );
}
