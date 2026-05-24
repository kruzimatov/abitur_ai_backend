import api from './api';

export interface TeacherDashboardData {
  subject: { id: number; name: string };
  active_students: number;
  total_topics: number;
  total_questions: number;
  total_attempts: number;
  avg_score: number;
}

export interface TopicScore {
  topic_id: number;
  topic_title: string;
  total_attempts: number;
  unique_students: number;
  avg_score: number;
}

export interface StudentRanking {
  user_id: number;
  firstname: string;
  lastname: string;
  avg_score: number;
  total_tests: number;
  last_active: string | null;
}

export interface TeacherAnalytics {
  topic_scores: TopicScore[];
  student_rankings: StudentRanking[];
}

export interface TeacherStudent {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  total_tests: number;
  avg_score: number;
  last_active: string | null;
}

export interface TeacherContent {
  subject: { id: number; name: string };
  total_topics: number;
  total_questions: number;
  topics: {
    id: number;
    title: string;
    order_num: number;
    questions_count: number;
    total_attempts: number;
    has_content: boolean;
  }[];
}

export const teacherService = {
  async getDashboard(): Promise<TeacherDashboardData> {
    const { data } = await api.get<TeacherDashboardData>('/teacher/dashboard');
    return data;
  },

  async getAnalytics(): Promise<TeacherAnalytics> {
    const { data } = await api.get<TeacherAnalytics>('/teacher/analytics');
    return data;
  },

  async getStudents(): Promise<{ subject: { id: number; name: string }; total: number; students: TeacherStudent[] }> {
    const { data } = await api.get('/teacher/students');
    return data;
  },

  async getContent(): Promise<TeacherContent> {
    const { data } = await api.get<TeacherContent>('/teacher/content');
    return data;
  },
};
