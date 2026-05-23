import api from './api';
import type {
  QuizStartResponse,
  QuizSubmitPayload,
  QuizSubmitResponse,
  QuizAttempt,
  PaginatedResponse,
} from '../types';

export const quizService = {
  async startQuiz(topicId: number): Promise<QuizStartResponse> {
    const { data } = await api.post<QuizStartResponse>(`/quiz/${topicId}/start`);
    return data;
  },

  async submitQuiz(payload: QuizSubmitPayload): Promise<QuizSubmitResponse> {
    const { data } = await api.post<QuizSubmitResponse>('/quiz/submit', payload);
    return data;
  },

  async getQuizResult(attemptId: number): Promise<QuizAttempt> {
    const { data } = await api.get<QuizAttempt>(`/quiz/result/${attemptId}`);
    return data;
  },

  async getQuizHistory(page = 1, perPage = 20): Promise<PaginatedResponse<QuizAttempt>> {
    const { data } = await api.get<PaginatedResponse<QuizAttempt>>('/quiz/history', {
      params: { page, per_page: perPage },
    });
    return data;
  },
};
