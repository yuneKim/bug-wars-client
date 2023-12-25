import { authService } from '@/services/authService';
import type { LoginDto, User } from '@/types';
import axios, { type AxiosResponse } from 'axios';
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
  const authError = ref('');
  const testTimer = ref<number>(0);

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
    user.value = {
      username: response.data.username,
      roles: response.data.roles,
    };
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    window.clearTimeout(testTimer.value);
    testTimer.value = window.setTimeout(() => {
      console.log('accessToken expire');
    }, 5000);

    // router.push({ name: 'home' });
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
    authService.logout();
    router.push({ name: 'home' });
  }

  function clearAuthError() {
    authError.value = '';
  }

  return {
    user,
    authError,
    clearAuthError,
    login,
    logout,
  };
});
