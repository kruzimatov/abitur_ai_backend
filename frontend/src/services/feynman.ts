import api from './api';
import type { FeynmanResponse } from '../types';

export const feynmanService = {
  async evaluate(topicId: number, explanation: string): Promise<FeynmanResponse> {
    const { data } = await api.post<FeynmanResponse>('/feynman/evaluate', {
      topic_id: topicId,
      explanation,
    });
    return data;
  },
};
