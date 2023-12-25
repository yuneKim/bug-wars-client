import type { LoginDto as loginDto } from '@/types';
import axios from 'axios';

export const authService = {
  login(loginDto: loginDto) {
    return axios.post('/auth/login', loginDto);
  },

  logout() {
    axios.post('/auth/logout');
  },
};
