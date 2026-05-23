import api from './api';
import type { ChatSession, ChatAskResponse, TutorAskResponse } from '../types';

export const chatService = {
  async getChatHistory(): Promise<ChatSession[]> {
    const { data } = await api.get<ChatSession[]>('/tutor/history');
    return data;
  },

  async createChat(subjectId?: number): Promise<ChatSession> {
    const { data } = await api.post<ChatSession>('/tutor/chat', {
      subject_id: subjectId || null,
    });
    return data;
  },

  async getChat(chatId: number): Promise<ChatSession> {
    const { data } = await api.get<ChatSession>(`/tutor/chat/${chatId}`);
    return data;
  },

  async askChat(chatId: number, question: string): Promise<ChatAskResponse> {
    const { data } = await api.post<ChatAskResponse>(`/tutor/chat/${chatId}/ask`, {
      question,
    });
    return data;
  },

  async deleteChat(chatId: number): Promise<void> {
    await api.delete(`/tutor/chat/${chatId}`);
  },

  // Stateless tutor (no chat session)
  async askTutor(question: string, subject?: string): Promise<TutorAskResponse> {
    const { data } = await api.post<TutorAskResponse>('/tutor/ask', {
      question,
      subject: subject || undefined,
    });
    return data;
  },
};
