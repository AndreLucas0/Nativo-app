import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, tokenStorage, AuthResponse } from '../services/api';
import { authBus } from '../utils/authBus';

type User = AuthResponse['user'];

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authBus.onUnauthorized(() => setUser(null));
  }, []);

  useEffect(() => {
    tokenStorage.getAccess().then((token) => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      api.get<{ id: string; name: string; email: string; totalXp: number; currentLevel: number }>('/api/users/me')
        .then(setUser)
        .catch(() => tokenStorage.clear())
        .finally(() => setIsLoading(false));
    });
  }, []);

  const handleAuthResponse = async (response: AuthResponse) => {
    await tokenStorage.setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  };

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
    await handleAuthResponse(response);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>('/api/auth/register', { name, email, password });
    await handleAuthResponse(response);
  };

  const logout = async () => {
    await tokenStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
