import api from './api';
import type { Subject, Topic } from '../types';

export const subjectService = {
  async getSubjects(): Promise<Subject[]> {
    const { data } = await api.get<Subject[]>('/subjects');
    return data;
  },

  async getSubjectTopics(subjectId: number): Promise<Topic[]> {
    const { data } = await api.get<Topic[]>(`/subjects/${subjectId}/topics`);
    return data;
  },

  async getTopic(topicId: number): Promise<Topic> {
    const { data } = await api.get<Topic>(`/topics/${topicId}`);
    return data;
  },
};
