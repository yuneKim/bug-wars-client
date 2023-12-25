import authService from '@/services/authService';
import type { LoginDto, User } from '@/types';
import axios, { type AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const emptyUser: User = {
    token: '',
    type: '',
    username: '',
    roles: [],
  };
  const user = ref<User>(getUserFromLocalStorage());
  const logoutTimer = ref<number>(0);
  const authError = ref('');

  watch(
    user,
    (user) => {
      axios.defaults.headers.common.Authorization = `Bearer ${user.token}`;
      if (user.token.length === 0) return;

      try {
        const decodedToken = jwtDecode(user.token);
        if (decodedToken.exp == null) {
          return;
        }
        autoLogout(decodedToken.exp);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    },
    { immediate: true },
  );

  function getUserFromLocalStorage(): User {
    const parsedUser = JSON.parse(localStorage.getItem('user') ?? '{}');
    if (Object.keys(parsedUser).length === 0) return emptyUser;
    return parsedUser;
  }

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
    user.value = response.data;
    localStorage.setItem('user', JSON.stringify(response.data));

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
    console.log('Token expired. User logged out.');
    user.value = emptyUser;
    localStorage.removeItem('user');
    router.push({ name: 'login' });
  }

  function autoLogout(expirationDate: number) {
    const currentDateInSeconds = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = expirationDate - currentDateInSeconds;

    window.clearTimeout(logoutTimer.value);

    logoutTimer.value = window.setTimeout(
      () => {
        logout();
      },
      Math.max(timeUntilExpiration, 0) * 1000,
    );
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
