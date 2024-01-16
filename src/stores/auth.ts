import type { RetryAxiosRequestConfig } from '@/config/axios';
import { authService } from '@/services/authService';
import type { LoginDto, User } from '@/types';
import { type SuccessResponse } from '@/utils/makeRequest';
import { objectsHaveSameKeys } from '@/utils/objectsHaveSameKeys';
import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter, type RouteRecordName } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const emptyUser: User = {
    username: '',
    roles: [],
  };
  const user = ref<User>(emptyUser);
  const authError = ref('');
  const postLoginDestination = ref<RouteRecordName>('');

  async function login(loginDto: LoginDto) {
    const response = await authService.login(loginDto);

    if (response.type === 'success') {
      successfulLoginActions(response);
    } else {
      authError.value = response.error;
    }
  }

  function successfulLoginActions(response: SuccessResponse) {
    const responseUser = {
      username: response.data.username,
      roles: response.data.roles,
    };
    user.value = responseUser;
    localStorage.setItem('user', JSON.stringify(responseUser));
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    router.push({ name: postLoginDestination.value });
  }

  function logout(redirect = true) {
    user.value = emptyUser;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    authService.logout();
    if (redirect) router.push({ name: 'home' });
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

  function setPostLoginDestination(routeName: RouteRecordName) {
    postLoginDestination.value = routeName;
  }

  return {
    user,
    authError,
    clearAuthError,
    login,
    logout,
    attemptToRefreshToken,
    setPostLoginDestination,
    loadUserFromLocalStorage,
  };
});
