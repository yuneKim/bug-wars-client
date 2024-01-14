import { useAuthStore } from '@/stores/auth';
import axios, { type AxiosRequestConfig } from 'axios';

export interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export function configureAxios() {
  axios.defaults.baseURL = import.meta.env.VITE_REMOTE_API + '/api';
  axios.defaults.headers['Content-Type'] = 'application/json';

  axios.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { attemptToRefreshToken, logout } = useAuthStore();

      if (!axios.isAxiosError(error)) {
        console.error('Non-axios error: ', error);
        return Promise.reject(error);
      }

      const originalRequest: RetryAxiosRequestConfig | undefined = error.config;
      if (originalRequest == null) return Promise.reject(error);

      if (error.response?.status === 401 && error.response.data.path !== '/api/auth/login') {
        if (originalRequest._retry) {
          originalRequest._retry = true;

          return await attemptToRefreshToken(originalRequest);
        } else {
          logout(true);
        }
      }
      return Promise.reject(error);
    },
  );
}
