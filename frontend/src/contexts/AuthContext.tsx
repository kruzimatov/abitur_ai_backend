import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth';
import type { LoginCredentials, RegisterData, User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): User | null {
  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => readStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  const persistAuth = useCallback((nextToken: string, nextUser: User) => {
    localStorage.setItem('token', nextToken);
    localStorage.setItem('user', JSON.stringify(nextUser));
    localStorage.removeItem('is_auth');
    localStorage.removeItem('role_name');
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('is_auth');
    localStorage.removeItem('role_name');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const nextUser = await authService.getUser();
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (!localStorage.getItem('token')) {
        if (active) setIsLoading(false);
        return;
      }

      try {
        const nextUser = await authService.getUser();
        if (!active) return;
        localStorage.setItem('user', JSON.stringify(nextUser));
        setUser(nextUser);
        setToken(localStorage.getItem('token'));
      } catch {
        if (active) clearAuth();
      } finally {
        if (active) setIsLoading(false);
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, [clearAuth]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    persistAuth(response.token, response.user);
  }, [persistAuth]);

  const register = useCallback(async (payload: RegisterData) => {
    const response = await authService.register(payload);
    persistAuth(response.token, response.user);
  }, [persistAuth]);

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem('token')) {
        await authService.logout();
      }
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }), [isLoading, login, logout, refreshUser, register, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
