import type { RetryAxiosRequestConfig } from '@/axios';
import { authService } from '@/services/authService';
import type { LoginDto, User } from '@/types';
import { objectsHaveSameKeys } from '@/utils/objectsHaveSameKeys';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const emptyUser: User = {
    username: '',
    roles: [],
  };
  const user = ref<User>(emptyUser);
  loadUserFromLocalStorage();
  const authError = ref('');

  async function login(loginDto: LoginDto) {
    let response;
    try {
      response = await authService.login(loginDto);
      if (response.status === 200) {
        successfulLoginActions(response);
      }
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleLoginError(error);
    }
  }

  function successfulLoginActions(response: AxiosResponse) {
    const responseUser = {
      username: response.data.username,
      roles: response.data.roles,
    };
    user.value = responseUser;
    localStorage.setItem('user', JSON.stringify(responseUser));
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    router.push({ name: 'home' });
  }

  function handleLoginError(error: Error) {
    if (!axios.isAxiosError(error)) {
      console.error('Non-axios error:', error);
      return;
    }

    if (error.response?.status === 400) {
      authError.value = 'Username and Password cannot be blank.';
    } else if (error.response?.status === 401) {
      authError.value = 'Your login attempt failed. Please try again.';
    } else {
      authError.value = 'Something went wrong on our end. Try again later.';
    }
  }

  function logout() {
    user.value = emptyUser;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    authService.logout();
    router.push({ name: 'login' });
  }

  function clearAuthError() {
    authError.value = '';
  }

  async function loadUserFromLocalStorage() {
    try {
      await attemptToRefreshToken();
    } catch (error) {
      console.error(error);
    }

    const localUser = localStorage.getItem('user');
    if (localUser == null) return;

    try {
      const parsedUser = JSON.parse(localUser);
      if (objectsHaveSameKeys(parsedUser, emptyUser)) {
        user.value = parsedUser;
        return;
      }
      logout();
    } catch (error) {
      logout();
    }
  }

  async function attemptToRefreshToken(
    originalRequest: RetryAxiosRequestConfig | undefined = undefined,
  ) {
    try {
      const response = await authService.refreshToken();
      if (response == null) return;
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);

      if (originalRequest == null) return;

      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      return axios(originalRequest);
    } catch (_error) {
      if (_error instanceof AxiosError && _error.response?.status === 403) {
        logout();
        return Promise.resolve('logout successful');
      }
      return Promise.reject(_error);
    }
  }

  return {
    user,
    authError,
    clearAuthError,
    login,
    logout,
    attemptToRefreshToken,
  };
});
