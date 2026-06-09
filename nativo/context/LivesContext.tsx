// ARQUIVO: context/LivesContext.tsx
// Gerencia o sistema de vidas (corações) do jogo.
// O usuário tem no máximo 5 vidas. Cada resposta errada consome 1 vida.
// As vidas se regeneram automaticamente: 1 vida a cada 5 minutos.
// O estado persiste entre sessões usando SecureStore (nativo) ou localStorage (web).

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const MAX_LIVES = 5;               // máximo de vidas simultâneas
const REGEN_MS = 5 * 60 * 1000;   // tempo para regenerar 1 vida: 5 minutos em ms
const STORAGE_KEY = 'nativo_lives_timestamps'; // chave no armazenamento local

// Abstração de storage: SecureStore no nativo, localStorage na web
const storage = {
  getItem: (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') return Promise.resolve(localStorage.getItem(key));
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return Promise.resolve(); }
    return SecureStore.setItemAsync(key, value);
  },
};

// Carrega o array de timestamps do armazenamento persistente
async function loadTimestamps(): Promise<number[]> {
  try {
    const raw = await storage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch { return []; }
}

// Salva o array de timestamps no armazenamento persistente
async function saveTimestamps(ts: number[]): Promise<void> {
  try { await storage.setItem(STORAGE_KEY, JSON.stringify(ts)); } catch {}
}

// Filtra apenas os timestamps ainda ativos (dentro da janela de 5 minutos)
// → cada timestamp representa o momento em que uma vida foi perdida
// → se passaram mais de 5 min desde a perda, a vida já regenerou (timestamp descartado)
function activeOnly(ts: number[]): number[] {
  const cutoff = Date.now() - REGEN_MS;
  return ts.filter(t => t > cutoff);
}

// Formato do contexto exposto às telas
type LivesContextType = {
  lives: number;            // número de vidas disponíveis no momento
  nextLifeAt: number | null; // timestamp (ms) em que a próxima vida vai regenerar
  decrementLives: () => void; // consome 1 vida (chamado ao errar uma questão)
};

const LivesContext = createContext<LivesContextType | null>(null);

export function LivesProvider({ children }: { children: ReactNode }) {
  // Armazena os timestamps de quando cada vida foi perdida (ainda dentro da janela de 5 min)
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false); // evita salvar antes de carregar

  // Carrega os timestamps salvos ao iniciar o app
  useEffect(() => {
    loadTimestamps().then(ts => {
      setTimestamps(activeOnly(ts)); // já descarta os expirados ao carregar
      setLoaded(true);
    });
  }, []);

  // Persiste os timestamps toda vez que mudarem (após o carregamento inicial)
  useEffect(() => {
    if (!loaded) return;
    saveTimestamps(timestamps);
  }, [timestamps, loaded]);

  // Verifica a cada 30 segundos se alguma vida regenerou e limpa timestamps expirados
  useEffect(() => {
    const id = setInterval(() => {
      setTimestamps(prev => activeOnly(prev));
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  // Vidas disponíveis = máximo − quantas ainda estão na janela de penalidade
  const lives = MAX_LIVES - timestamps.length;

  // Próxima regeneração = 5 min após o timestamp mais antigo ainda ativo
  const nextLifeAt = timestamps.length > 0 ? Math.min(...timestamps) + REGEN_MS : null;

  // Consome 1 vida: registra o timestamp atual (só se ainda houver vidas disponíveis)
  const decrementLives = () => {
    setTimestamps(prev => {
      const active = activeOnly(prev);
      if (active.length >= MAX_LIVES) return active; // sem vidas → não adiciona
      return [...active, Date.now()];
    });
  };

  return (
    <LivesContext.Provider value={{ lives, nextLifeAt, decrementLives }}>
      {children}
    </LivesContext.Provider>
  );
}

// Hook de acesso ao sistema de vidas — deve ser usado dentro de LivesProvider
export function useLives() {
  const ctx = useContext(LivesContext);
  if (!ctx) throw new Error('useLives deve ser usado dentro de LivesProvider');
  return ctx;
}
