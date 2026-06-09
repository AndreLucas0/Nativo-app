// ARQUIVO: context/AuthContext.tsx
// Gerencia o estado de autenticação do app (usuário logado, login, registro, logout).
// Expõe via Context API para que qualquer tela acesse com o hook useAuth().

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, tokenStorage, AuthResponse } from '../services/api';
import { authBus } from '../utils/authBus';

// Tipo do usuário logado (mesmos campos retornados pelo backend)
type User = AuthResponse['user'];

// Formato do contexto exposto às telas
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Cria o contexto (começa nulo; valor real é injetado pelo AuthProvider)
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true enquanto verifica o token salvo

  // Escuta o evento de sessão expirada emitido pelo api.ts (erro 401 não renovável)
  // → desloga o usuário automaticamente sem precisar chamar logout() manualmente
  useEffect(() => {
    authBus.onUnauthorized(() => setUser(null));
  }, []);

  // Ao iniciar o app: verifica se existe um token salvo e busca os dados do usuário
  useEffect(() => {
    tokenStorage.getAccess().then((token) => {
      if (!token) {
        setIsLoading(false); // sem token → não está logado
        return;
      }
      // Com token válido → busca o perfil do usuário na API
      api.get<{ id: string; name: string; email: string; totalXp: number; currentLevel: number }>('/api/users/me')
        .then(setUser)
        .catch(() => tokenStorage.clear()) // token inválido → limpa o armazenamento
        .finally(() => setIsLoading(false));
    });
  }, []);

  // Salva os tokens no armazenamento seguro e atualiza o estado do usuário
  const handleAuthResponse = async (response: AuthResponse) => {
    await tokenStorage.setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  };

  // Faz login: envia email e senha, recebe os tokens e os armazena
  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
    await handleAuthResponse(response);
  };

  // Registra novo usuário: envia nome, email e senha, recebe os tokens
  const register = async (name: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>('/api/auth/register', { name, email, password });
    await handleAuthResponse(response);
  };

  // Logout: apaga os tokens do armazenamento e limpa o usuário do estado
  const logout = async () => {
    await tokenStorage.clear();
    setUser(null);
  };

  // isAuthenticated é true sempre que houver um usuário carregado
  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook de acesso ao contexto de autenticação — deve ser usado dentro de AuthProvider
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
