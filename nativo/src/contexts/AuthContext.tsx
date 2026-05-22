import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { login, signup } from '@/src/api/auth';
import {
  clearSession,
  saveAccessToken,
  saveRefreshToken,
} from '@/src/services/storage';

import { LoginDTO, SignupDTO } from '@/src/types/auth';
import { User } from '@/src/types/user';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (data: LoginDTO) => Promise<void>;
  signUp: (data: SignupDTO) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextData);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  async function signIn(data: LoginDTO) {
    try {
      setLoading(true);

      const response = await login(data);

      await saveAccessToken(response.accessToken);
      await saveRefreshToken(response.refreshToken);

      setUser(response.user);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(data: SignupDTO) {
    try {
      setLoading(true);

      const response = await signup(data);

      await saveAccessToken(response.accessToken);
      await saveRefreshToken(response.refreshToken);

      setUser(response.user);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await clearSession();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}