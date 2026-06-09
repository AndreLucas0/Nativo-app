// ARQUIVO: services/api.ts
// Camada de comunicação com o backend.
// Contém: armazenamento de tokens, cliente HTTP com refresh automático de token,
// e todos os tipos TypeScript que espelham as respostas da API.

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { authBus } from '../utils/authBus';

// ── URL base do servidor ──────────────────────────────────────────────────────
// Prioridade: variável de ambiente → plataforma detectada → IP local configurado
const LOCAL_MACHINE_IP = '192.168.1.100'; // <-- ALTERE AQUI (dev local apenas)

function resolveBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (Platform.OS === 'web') return 'http://localhost:8080';
  if (Platform.OS === 'android') return 'http://10.0.2.2:8080'; // emulador Android
  return `http://${LOCAL_MACHINE_IP}:8080`; // iOS físico via Expo Go
}

export const BASE_URL = resolveBaseUrl();

// ── Chaves de armazenamento dos tokens JWT ────────────────────────────────────
const ACCESS_TOKEN_KEY = 'nativo_access_token';
const REFRESH_TOKEN_KEY = 'nativo_refresh_token';

// Abstração de storage: usa SecureStore no nativo e localStorage na web
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

// ── Funções para ler, salvar e apagar os tokens JWT ───────────────────────────
export const tokenStorage = {
  getAccess: () => storage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => storage.getItem(REFRESH_TOKEN_KEY),
  setTokens: async (access: string, refresh: string) => {
    await storage.setItem(ACCESS_TOKEN_KEY, access);
    await storage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  // Apaga ambos os tokens (usado no logout ou quando a sessão expira)
  clear: async () => {
    await storage.removeItem(ACCESS_TOKEN_KEY);
    await storage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// Classe de erro customizada para carregar o status HTTP junto à mensagem
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// ── Renovação automática do access token ──────────────────────────────────────
// Chamado quando a API retorna 401: tenta trocar o refreshToken por um novo par de tokens
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

// ── Função principal de requisição HTTP ───────────────────────────────────────
// Envia a requisição com o token atual. Se receber 401, tenta renovar o token
// e retentar. Se o refresh também falhar, desloga o usuário via authBus.
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

  // 204 = No Content → retorna undefined sem tentar ler o corpo
  if (response.status === 204) return undefined as T;

  // ── Interceptor 401: tenta refresh antes de deslogar ─────────────────────
  if (response.status === 401 && path !== '/api/auth/refresh') {
    const newToken = await tryRefreshToken();
    if (newToken) {
      // Retentar com o novo token
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
    // Refresh falhou → limpa sessão e notifica o AuthContext para deslogar
    await tokenStorage.clear();
    authBus.emit();
    throw new ApiError(401, 'Sessão expirada. Faça login novamente.');
  }

  // Qualquer outro erro HTTP → lança ApiError com a mensagem do servidor
  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
    throw new ApiError(response.status, err.message ?? `HTTP ${response.status}`);
  }

  return response.json();
}

// ── Objeto público da API ─────────────────────────────────────────────────────
// Atalhos para os métodos HTTP mais usados nas telas
export const api = {
  get:  <T>(path: string)              => request<T>(path, 'GET'),
  post: <T>(path: string, body?: object) => request<T>(path, 'POST', body),
  put:  <T>(path: string, body?: object) => request<T>(path, 'PUT', body),
};

// ── Tipos TypeScript das respostas do backend ─────────────────────────────────

// Retorno do login e do registro
export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; name: string; email: string; totalXp: number; currentLevel: number };
};

// Dashboard principal: estatísticas, cursos ativos e lições concluídas recentemente
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
  passedLessonIds: string[]; // IDs de todas as lições que o usuário já concluiu
};

// Item da lista de cursos disponíveis
export type CourseListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconUrl: string | null;
  totalXpReward: number;
  difficulty: string;
};

// Detalhes completos de um curso (módulos + lições)
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

// Conteúdo de uma lição com seus exercícios
export type LessonContentResponse = {
  id: string;
  title: string;
  description: string;
  content: string;
  xpReward: number;
  minimumScore: number;
  alreadyCompleted: boolean; // true se o usuário já completou esta lição antes
  exercises: {
    id: string;
    question: string;
    exerciseType: string;
    options: string[];
    displayOrder: number;
  }[];
};

// Retorno ao submeter a resposta de um exercício
export type ExerciseSubmitResponse = {
  attemptId: string;
  correct: boolean;      // true se o usuário acertou
  explanation: string;   // explicação da resposta correta
};

// Perfil completo do usuário logado
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

// Corpo da requisição de atualização de perfil
export type UpdateProfileRequest = {
  name?: string;
  profileImageUrl?: string;
};

// Corpo da requisição de troca de senha
export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

// Uma entrada no ranking global
export type RankingEntry = {
  position: number;
  userId: string;
  name: string;
  profileImageUrl: string | null;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  isCurrentUser: boolean; // true para destacar o próprio usuário na lista
};

// Resultado ao completar uma lição: XP ganho, aprovação, streaks atualizados
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
