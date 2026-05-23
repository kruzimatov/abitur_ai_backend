import api from './api';
import type { DashboardData } from '../types';

export const dashboardService = {
  async getStudentDashboard(): Promise<DashboardData> {
    const { data } = await api.get<DashboardData>('/dashboard/student');
    return data;
  },
};
