import api from './api';

export interface AdminDashboardData {
  total_users: number;
  total_subjects: number;
  total_topics: number;
  total_questions: number;
  total_quiz_attempts: number;
}

export const adminService = {
  async getDashboard(): Promise<AdminDashboardData> {
    const { data } = await api.get<AdminDashboardData>('/dashboard/admin');
    return data;
  },
};
