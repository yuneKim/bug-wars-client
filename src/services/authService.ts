import type { LoginDto, RegisterDto, UserProfileUpdateDto, UserProfileResponse } from '@/types';
import { makeRequest } from '@/utils/makeRequest';

import axios from 'axios';
import { error } from 'node:console';

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
    /*Updates user profile information*/
  updateUserProfile(profileUpdateDto: UserProfileUpdateDto) {
    return makeRequest(() => axios.put('/auth/update-profile', profileUpdateDto), {
      successStatuses: [200],
      errorStatuses: {
        400: 'Invalid request.',
        401: 'You must be logged in to update your profile.',
        403: 'You do not have permission to update this profile.',
        404: 'User not found.',
      },
    });
  },

  getUserProfile() {
    return makeRequest(() => axios.get('/auth/user-profile'), {
      successStatuses: [200],
      errorStatuses: {
        401: 'You must be logged in to view your profile.',
        404: 'User not found.',
      },
    })
    .then((response) => {
      if (response.type === 'success') {
        return response.data as UserProfileResponse;
      } else {
        console.error('Error response received:', response);
        throw error;
      }
    });
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
