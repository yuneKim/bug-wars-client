import type { LoginDto, User } from '@/types';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { authService } from './authService';

vi.mock('axios');

describe('authService', () => {
  it('makes a POST request to login', async () => {
    const loginDto: LoginDto = {
      username: 'some_user',
      password: 'some_password',
    };

    const mockResponse: User = {
      username: 'some_user',
      roles: ['ROLE_USER'],
    };

    vi.mocked(axios.post).mockResolvedValue({
      data: mockResponse,
    });

    const loginResponse = (await authService.login(loginDto)).data;

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), loginDto);
    expect(loginResponse).toStrictEqual(mockResponse);
  });

  it('makes a POST request to logout', async () => {
    authService.logout();

    expect(axios.post).toHaveBeenCalledWith(expect.any(String));
  });

  it('makes a POST request to refresh the token', async () => {
    localStorage.setItem('refreshToken', 'some_token');

    await authService.refreshToken();

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
      refreshToken: expect.any(String),
    });
  });

  it('throws an error if no refresh token is found', async () => {
    localStorage.removeItem('refreshToken');

    await expect(authService.refreshToken()).rejects.toBe('No refresh token found.');
  });
});
