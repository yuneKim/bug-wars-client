import type { LoginDto, User } from '@/types';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import authService from './authService';

vi.mock('axios');

describe('authService', () => {
  it('makes a POST request to login', async () => {
    const loginDto: LoginDto = {
      username: 'some_user',
      password: 'some_password',
    };

    const mockResponse: User = {
      token: 'a token',
      type: 'Bearer',
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
});
