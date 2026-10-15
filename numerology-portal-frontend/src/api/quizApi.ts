import axiosClient from './axiosClient';
import type { DiscQuestion, DiscResultDto, MbtiQuestion, MbtiResultDto } from '../types/quiz.types';

export const quizApi = {
  getDiscQuestions: (): Promise<{ success: boolean; data: DiscQuestion[] }> => {
    return axiosClient.get('/quizzes/disc/questions');
  },

  submitDisc: (selectedTraits: string[]): Promise<{ success: boolean; data: DiscResultDto; message: string }> => {
    return axiosClient.post('/quizzes/disc', selectedTraits);
  },

  getMbtiQuestions: (): Promise<{ success: boolean; data: MbtiQuestion[] }> => {
    return axiosClient.get('/quizzes/mbti/questions');
  },

  submitMbti: (answers: Record<string, string>): Promise<{ success: boolean; data: MbtiResultDto; message: string }> => {
    return axiosClient.post('/quizzes/mbti', answers);
  }
};
