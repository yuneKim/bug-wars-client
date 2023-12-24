import authService from '@/services/AuthService';
import type { LoginDto, User } from '@/types';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User>(JSON.parse(localStorage.getItem('user') ?? '{}'));
  const router = useRouter();
  const logoutTimer = ref<number>(0);

  watch(
    user,
    (user) => {
      axios.defaults.headers.common.Authorization = `Bearer ${user.token}`;

      if (!('token' in user)) {
        return;
      }

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

  async function login(loginDto: LoginDto) {
    const response = await authService.login(loginDto);
    user.value = response.data;
    localStorage.setItem('user', response.data);

    router.push({ name: 'channel', params: { channelId: 1 } });
  }

  function logout() {
    user.value = {} as User;
    localStorage.removeItem('user');
    router.push({ name: 'login' });
  }

  function autoLogout(expirationDate: number) {
    const currentDateInSeconds = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = expirationDate - currentDateInSeconds;

    window.clearTimeout(logoutTimer.value);

    logoutTimer.value = window.setTimeout(() => {
      logout();
    }, timeUntilExpiration * 1000);
  }

  return {
    user,
    login,
    logout,
  };
});
