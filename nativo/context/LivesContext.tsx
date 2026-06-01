import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const MAX_LIVES = 5;
const REGEN_MS = 5 * 60 * 1000;
const STORAGE_KEY = 'nativo_lives_timestamps';

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

async function loadTimestamps(): Promise<number[]> {
  try {
    const raw = await storage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch { return []; }
}

async function saveTimestamps(ts: number[]): Promise<void> {
  try { await storage.setItem(STORAGE_KEY, JSON.stringify(ts)); } catch {}
}

function activeOnly(ts: number[]): number[] {
  const cutoff = Date.now() - REGEN_MS;
  return ts.filter(t => t > cutoff);
}

type LivesContextType = {
  lives: number;
  nextLifeAt: number | null;
  decrementLives: () => void;
};

const LivesContext = createContext<LivesContextType | null>(null);

export function LivesProvider({ children }: { children: ReactNode }) {
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadTimestamps().then(ts => {
      setTimestamps(activeOnly(ts));
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveTimestamps(timestamps);
  }, [timestamps, loaded]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimestamps(prev => activeOnly(prev));
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  const lives = MAX_LIVES - timestamps.length;
  const nextLifeAt = timestamps.length > 0 ? Math.min(...timestamps) + REGEN_MS : null;

  const decrementLives = () => {
    setTimestamps(prev => {
      const active = activeOnly(prev);
      if (active.length >= MAX_LIVES) return active;
      return [...active, Date.now()];
    });
  };

  return (
    <LivesContext.Provider value={{ lives, nextLifeAt, decrementLives }}>
      {children}
    </LivesContext.Provider>
  );
}

export function useLives() {
  const ctx = useContext(LivesContext);
  if (!ctx) throw new Error('useLives deve ser usado dentro de LivesProvider');
  return ctx;
}
