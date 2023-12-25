import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export function configureAxios() {
  axios.defaults.baseURL = import.meta.env.VITE_REMOTE_API + '/api';
  axios.defaults.headers['Content-Type'] = 'application/json';

  axios.interceptors.request.use(
    (config) => {
      const accessToken = getLocalAccessToken();
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
      if (!axios.isAxiosError(error)) {
        console.error('Non-axios error: ', error);
        return Promise.reject(error);
      }

      const originalRequest: RetryAxiosRequestConfig | undefined = error.config;
      if (originalRequest == null) return Promise.reject(error);

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        return await attemptToRefreshToken(originalRequest);
      }
      return Promise.reject(error);
    },
  );
}

function getLocalAccessToken() {
  const accessToken = localStorage.getItem('accessToken');
  return accessToken;
}

async function attemptToRefreshToken(originalRequest: RetryAxiosRequestConfig) {
  const { logout } = useAuthStore();

  try {
    const rs = await authService.refreshToken();
    const { accessToken } = rs.data;
    window.localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return axios(originalRequest);
  } catch (_error) {
    if (_error instanceof AxiosError && _error.response?.status === 403) {
      logout();
      return Promise.resolve();
    }
    return Promise.reject(_error);
  }
}
