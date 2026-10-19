import axios from 'axios';

export const getApiBaseUrl = (): string => {
  // Khi chạy trên browser với giao thức HTTPS (như trên Vercel production),
  // bắt buộc dùng relative path '/api' để Vercel Serverless Function chuyển tiếp sang Somee HTTP,
  // tránh hoàn toàn lỗi Mixed Content (chặn HTTP trên trang HTTPS) và lỗi CORS.
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return '/api';
  }

  const url = import.meta.env.VITE_API_URL;
  if (url) {
    return url;
  }

  return import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';
};

export const axiosClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data;
    if (errorData) {
      if (typeof errorData === 'string') {
        return Promise.reject(new Error(errorData));
      }
      return Promise.reject(errorData);
    }
    return Promise.reject(new Error(error.message || 'Lỗi kết nối máy chủ'));
  }
);

export default axiosClient;
