import axiosClient from './axiosClient';
import type { AuthResponseDto, UserAccountDto } from '../types/user.types';

export const authApi = {
  login: (username: string, password: string): Promise<{ success: boolean; data: AuthResponseDto; message: string }> => {
    return axiosClient.post('/auth/login', { username, password });
  },

  register: (payload: { username: string; password: string; fullName?: string; phoneNumber?: string }): Promise<{ success: boolean; data: AuthResponseDto; message: string }> => {
    return axiosClient.post('/auth/register', payload);
  },

  getCurrentUser: (): Promise<{ success: boolean; data: UserAccountDto }> => {
    return axiosClient.get('/auth/me');
  }
};
