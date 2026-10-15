import axiosClient from './axiosClient';
import type { LookupReportDto } from '../types/report.types';

export interface CreateReportPayload {
  fullName: string;
  birthDate: string;
  birthTime?: string;
  gender?: string;
  serviceType?: number;
}

export const reportApi = {
  createReport: (payload: CreateReportPayload): Promise<{ success: boolean; data: LookupReportDto; message: string }> => {
    return axiosClient.post('/reports', payload);
  },

  getReportByToken: (token: string): Promise<{ success: boolean; data: LookupReportDto; message: string }> => {
    return axiosClient.get(`/reports/${token}`);
  },

  getPdfUrl: (token: string): string => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${base}/reports/${token}/pdf`;
  }
};
