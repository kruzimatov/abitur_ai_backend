import api from './api';
import type { AuthResponse, Field, LoginCredentials, RegisterData, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  async register(payload: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getUser(): Promise<User> {
    const { data } = await api.get<User>('/user');
    return data;
  },

  async getFields(): Promise<Field[]> {
    const { data } = await api.get<Field[]>('/fields');
    return data;
  },
};
