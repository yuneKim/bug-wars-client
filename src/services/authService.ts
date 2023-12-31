import type { LoginDto, RegisterDto } from '@/types';

import axios from 'axios';

export const authService = {
  register(registerDto: RegisterDto){
    return axios.post('/auth/register', registerDto);
  },

  login(loginDto: LoginDto) {
    return axios.post('/auth/login', loginDto);
  },

  logout() {
    axios.post('/auth/logout');
  },

  refreshToken() {
    const token = localStorage.getItem('refreshToken');
    if (!token) return Promise.reject('No refresh token found.');

    return axios.post('/auth/refresh-token', {
      refreshToken: token,
    });
  },


};
