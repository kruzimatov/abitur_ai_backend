import api from './api';
import type { SubjectProgress, Recommendation, StreakData } from '../types';

export const progressService = {
  async getSubjectProgress(): Promise<SubjectProgress[]> {
    const { data } = await api.get<SubjectProgress[]>('/progress/subjects');
    return data;
  },

  async getRecommendations(): Promise<Recommendation[]> {
    const { data } = await api.get<Recommendation[]>('/recommendations');
    return data;
  },

  async getStreak(): Promise<StreakData> {
    const { data } = await api.get<StreakData>('/streak');
    return data;
  },
};
