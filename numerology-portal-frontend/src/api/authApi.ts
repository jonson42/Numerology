import axiosClient from './axiosClient';
import type { AuthResponseDto, UserAccountDto } from '../types/user.types';

export const authApi = {
  loginPhone: (phoneNumber: string, fullName?: string): Promise<{ success: boolean; data: string; message: string }> => {
    return axiosClient.post('/auth/login-phone', { phoneNumber, fullName });
  },

  verifyOtp: (phoneNumber: string, otpCode: string): Promise<{ success: boolean; data: AuthResponseDto; message: string }> => {
    return axiosClient.post('/auth/verify-otp', { phoneNumber, otpCode });
  },

  getCurrentUser: (): Promise<{ success: boolean; data: UserAccountDto }> => {
    return axiosClient.get('/auth/me');
  }
};
