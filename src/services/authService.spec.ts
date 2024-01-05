import type { LoginDto, RegisterDto, User } from '@/types';
import { makeRequest, type SuccessResponse } from '@/utils/makeRequest';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { authService } from './authService';

vi.mock('axios');
vi.mock('@/utils/makeRequest');

describe('authService', () => {
  it('makes a POST request to register', async () => {
    const registerDto: RegisterDto = {
      username: 'some_user',
      password: 'some_password',
      email: 'some_email',
    };

    const mockResponse: User = {
      username: 'some_user',
      roles: ['ROLE_USER'],
    };

    const mockSuccessResponse: SuccessResponse = {
      type: 'success',
      status: 201,
      data: 'A message',
    };

    vi.mocked(makeRequest).mockImplementation(async (func: Function) => {
      func();
      return Promise.resolve(mockSuccessResponse);
    });

    vi.mocked(axios.post).mockResolvedValue({
      data: mockResponse,
    });

    const registerResponse = await authService.register(registerDto);

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), registerDto);
    expect(registerResponse).toStrictEqual(mockSuccessResponse);
  });

  it('makes a POST request to login', async () => {
    const loginDto: LoginDto = {
      username: 'some_user',
      password: 'some_password',
    };

    const mockResponse: User = {
      username: 'some_user',
      roles: ['ROLE_USER'],
    };

    const mockSuccessResponse: SuccessResponse = {
      type: 'success',
      status: 201,
      data: 'A message',
    };

    vi.mocked(makeRequest).mockImplementation(async (func: Function) => {
      func();
      return Promise.resolve(mockSuccessResponse);
    });

    vi.mocked(axios.post).mockResolvedValue({
      data: mockResponse,
    });

    const loginResponse = await authService.login(loginDto);

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), loginDto);
    expect(loginResponse).toStrictEqual(mockSuccessResponse);
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
