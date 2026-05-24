import api from './api';

export interface AdminDashboardData {
  total_users: number;
  total_subjects: number;
  total_topics: number;
  total_questions: number;
  total_quiz_attempts: number;
}

export interface UploadResult {
  message: string;
  subject: string;
  topic_id: string | null;
  title: string | null;
  chunks: number;
  characters: number;
}

export interface RagHealth {
  status: string;
  total_documents: number;
  total_topics: number;
  subjects: string[];
}

export const adminService = {
  async getDashboard(): Promise<AdminDashboardData> {
    const { data } = await api.get<AdminDashboardData>('/dashboard/admin');
    return data;
  },

  async uploadMaterial(file: File, subjectId: number, title?: string): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject_id', String(subjectId));
    if (title) formData.append('title', title);

    const { data } = await api.post<UploadResult>('/materials/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return data;
  },

  async getRagHealth(): Promise<RagHealth> {
    const { data } = await api.get<RagHealth>('/rag/health');
    return data;
  },
};
