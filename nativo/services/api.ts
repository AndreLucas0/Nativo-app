import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { authBus } from '../utils/authBus';

// ── Configuração de rede ──────────────────────────────────────────────────────
// Produção (EC2): defina EXPO_PUBLIC_API_URL=http://<EC2_IP>:8080 em nativo/.env
// Dev iOS físico: defina LOCAL_MACHINE_IP com seu IP local (ipconfig/ifconfig)
const LOCAL_MACHINE_IP = '192.168.1.100'; // <-- ALTERE AQUI (dev local apenas)

function resolveBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (Platform.OS === 'web') return 'http://localhost:8080';
  if (Platform.OS === 'android') return 'http://10.0.2.2:8080'; // emulador Android
  return `http://${LOCAL_MACHINE_IP}:8080`; // iOS físico via Expo Go
}

export const BASE_URL = resolveBaseUrl();

const ACCESS_TOKEN_KEY = 'nativo_access_token';
const REFRESH_TOKEN_KEY = 'nativo_refresh_token';

// expo-secure-store só funciona em native; usa localStorage como fallback na web
const storage = {
  getItem: (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return Promise.resolve(localStorage.getItem(key));
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export const tokenStorage = {
  getAccess: () => storage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => storage.getItem(REFRESH_TOKEN_KEY),
  setTokens: async (access: string, refresh: string) => {
    await storage.setItem(ACCESS_TOKEN_KEY, access);
    await storage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: async () => {
    await storage.removeItem(ACCESS_TOKEN_KEY);
    await storage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// ── Token refresh ─────────────────────────────────────────────────────────────

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = await tokenStorage.getRefresh();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    await tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

// ── HTTP client ───────────────────────────────────────────────────────────────

async function executeRequest<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body: object | undefined,
  token: string | null,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return undefined as T;
  return response;
}

async function request<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: object,
): Promise<T> {
  const token = await tokenStorage.getAccess();

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return undefined as T;

  // ── Interceptor 401: tenta refresh antes de deslogar ─────────────────────
  if (response.status === 401 && path !== '/api/auth/refresh') {
    const newToken = await tryRefreshToken();
    if (newToken) {
      // Retentar com o novo token (sem loop — não passa por este bloco de novo
      // porque a chamada interna usa o token diretamente)
      const retryResponse = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (retryResponse.status === 204) return undefined as T;
      if (!retryResponse.ok) {
        const err = await retryResponse.json().catch(() => ({ message: `HTTP ${retryResponse.status}` }));
        throw new ApiError(retryResponse.status, err.message ?? `HTTP ${retryResponse.status}`);
      }
      return retryResponse.json();
    }
    // Refresh falhou — limpar sessão e notificar a aplicação
    await tokenStorage.clear();
    authBus.emit();
    throw new ApiError(401, 'Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
    throw new ApiError(response.status, err.message ?? `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path, 'GET'),
  post: <T>(path: string, body?: object) => request<T>(path, 'POST', body),
  put: <T>(path: string, body?: object) => request<T>(path, 'PUT', body),
};

// ── Tipos espelhando o backend ────────────────────────────────────────────────

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; name: string; email: string; totalXp: number; currentLevel: number };
};

export type DashboardResponse = {
  userStats: {
    totalXp: number;
    currentLevel: number;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string | null;
  };
  activeCourses: {
    courseId: string;
    courseTitle: string;
    slug: string;
    iconUrl: string | null;
    progressPercentage: number;
    completedLessons: number;
  }[];
  recentCompletions: {
    lessonId: string;
    lessonTitle: string;
    courseId: string;
    courseTitle: string;
    score: number;
    passed: boolean;
    xpEarned: number;
    completedAt: string;
  }[];
  passedLessonIds: string[];
};

export type CourseListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconUrl: string | null;
  totalXpReward: number;
  difficulty: string;
};

export type CourseDetailResponse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  modules: {
    id: string;
    title: string;
    description: string;
    displayOrder: number;
    lessons: {
      id: string;
      title: string;
      description: string;
      displayOrder: number;
      xpReward: number;
    }[];
  }[];
};

export type LessonContentResponse = {
  id: string;
  title: string;
  description: string;
  content: string;
  xpReward: number;
  minimumScore: number;
  alreadyCompleted: boolean;
  exercises: {
    id: string;
    question: string;
    exerciseType: string;
    options: string[];
    displayOrder: number;
  }[];
};

export type ExerciseSubmitResponse = {
  attemptId: string;
  correct: boolean;
  explanation: string;
};

export type UserProfileResponse = {
  id: string;
  email: string;
  name: string;
  profileImageUrl: string | null;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
};

export type UpdateProfileRequest = {
  name?: string;
  profileImageUrl?: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type RankingEntry = {
  position: number;
  userId: string;
  name: string;
  profileImageUrl: string | null;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  isCurrentUser: boolean;
};

export type LessonCompleteResponse = {
  passed: boolean;
  score: number;
  xpEarned: number;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  progressPercentage: number;
  exercises: { exerciseId: string; correct: boolean; explanation: string }[];
};
