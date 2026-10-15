import axiosClient from './axiosClient';

export interface DashboardStats {
  totalUsers: number;
  totalVipUsers: number;
  totalReports: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    orderCode: string;
    phoneNumber: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export interface InterpretationItem {
  id: string;
  serviceType: number;
  indicatorCode: string;
  indicatorName: string;
  numberKey: string;
  title: string;
  summary: string;
  contentHtml: string;
  isVipOnly: boolean;
  sortOrder: number;
}

export const adminApi = {
  getDashboardStats: (): Promise<{ success: boolean; data: DashboardStats }> => {
    return axiosClient.get('/admin/dashboard');
  },

  getInterpretations: (serviceType?: number): Promise<{ success: boolean; data: InterpretationItem[] }> => {
    return axiosClient.get('/admin/interpretations', { params: { serviceType } });
  },

  updateInterpretation: (id: string, payload: Partial<InterpretationItem>): Promise<{ success: boolean; message: string }> => {
    return axiosClient.put(`/admin/interpretations/${id}`, payload);
  },

  getOrders: (): Promise<{ success: boolean; data: any[] }> => {
    return axiosClient.get('/admin/orders');
  },

  getUsers: (): Promise<{ success: boolean; data: any[] }> => {
    return axiosClient.get('/admin/users');
  },

  toggleVip: (userId: string): Promise<{ success: boolean; data: boolean; message: string }> => {
    return axiosClient.post(`/admin/users/${userId}/toggle-vip`);
  }
};
