import type { LoginDto, User } from '@/types';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import AuthService from './AuthService';

vi.mock('axios');

describe('AuthService', () => {
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

    const loginResponse = (await AuthService.login(loginDto)).data;

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), loginDto);
    expect(loginResponse).toStrictEqual(mockResponse);
  });
});
