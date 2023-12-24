import authService from '@/services/AuthService';
import type { LoginDto, User } from '@/types';
import axios from 'axios';
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
    const response = await authService.login(loginDto);
    user.value = response.data;
    localStorage.setItem('user', JSON.stringify(response.data));

    router.push({ name: 'home' });
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

    logoutTimer.value = window.setTimeout(() => {
      logout();
    }, timeUntilExpiration * 3);
  }

  return {
    user,
    login,
    logout,
  };
});
