import axiosClient from './axiosClient';
import type { OrderDetailResponse, OrderStatusCheckResponse } from '../types/payment.types';

export const paymentApi = {
  createOrder: (phoneNumber: string, packageType: string = '1_YEAR'): Promise<{ success: boolean; data: OrderDetailResponse; message: string }> => {
    return axiosClient.post('/payments/create-order', { phoneNumber, packageType });
  },

  checkOrderStatus: (orderCode: string): Promise<{ success: boolean; data: OrderStatusCheckResponse; message: string }> => {
    return axiosClient.get(`/payments/check-order/${orderCode}`);
  },

  simulatePaymentSuccess: (orderCode: string): Promise<{ success: boolean; data: string; message: string }> => {
    return axiosClient.post(`/payments/simulate-success/${orderCode}`);
  }
};
