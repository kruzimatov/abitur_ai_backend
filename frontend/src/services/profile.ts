import api from './api';
import type { ProfileResponse, User } from '../types';

export const profileService = {
  async getProfile(): Promise<ProfileResponse> {
    const { data } = await api.get<ProfileResponse>('/profile');
    return data;
  },

  async updateProfile(payload: Partial<Pick<User, 'firstname' | 'lastname' | 'gender' | 'field_id'>>): Promise<{ message: string; user: User }> {
    const { data } = await api.put<{ message: string; user: User }>('/profile', payload);
    return data;
  },
};
