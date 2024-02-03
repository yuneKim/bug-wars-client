import type { LoginDto, RegisterDto } from '@/types';
import { makeRequest } from '@/utils/makeRequest';

import axios from 'axios';

export const authService = {
  register(registerDto: RegisterDto) {
    return makeRequest(() => axios.post('/auth/register', registerDto), {
      successStatuses: [201],
      errorStatuses: {
        400: 'Inappropriate language.',
        409: (response) => response.data.message,
      },
    });
  },

  login(loginDto: LoginDto) {
    return makeRequest(() => axios.post('/auth/login', loginDto), {
      successStatuses: [200],
      errorStatuses: {
        400: 'Username and Password cannot be blank.',
        401: 'Your login attempt failed. Please try again.',
      },
    });
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
  verifyEmail(username:string, token:string) {
    return axios.post(`/auth/verify/${username}/${token}`, {
      
    });
  }
};
