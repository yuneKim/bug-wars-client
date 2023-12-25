import type { RetryAxiosRequestConfig } from '@/axios';
import { authService } from '@/services/authService';
import type { LoginDto, User } from '@/types';
import { flushPromises } from '@vue/test-utils';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from './auth';

vi.mock('@/services/authService');
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));
vi.mock('jwt-decode');

const emptyUser: User = {
  username: '',
  roles: [],
};

describe('Auth Store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('should login and store a user', async () => {
    const loginDto: LoginDto = {
      username: 'some_user',
      password: 'some_password',
    };

    const mockUser: User = {
      username: 'some_user',
      roles: ['ROLE_USER'],
    };

    const mockResponse: AxiosResponse<any, any> = {
      data: mockUser,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };

    const { login } = useAuthStore();
    const { user } = storeToRefs(useAuthStore());

    vi.mocked(authService.login).mockResolvedValue(mockResponse);

    await login(loginDto);

    expect(authService.login).toHaveBeenCalledOnce();
    expect(user.value).toStrictEqual(mockUser);
    expect(JSON.parse(localStorage.getItem('user') ?? '{}')).toStrictEqual(mockUser);
  });

  it('should handle errors: 400 response status', async () => {
    const loginDto: LoginDto = {
      username: 'some_user',
      password: 'some_password',
    };

    const mockResponse: AxiosResponse<any, any> = {
      status: 400,
      data: undefined,
      statusText: '',
      headers: {},
      config: {} as any,
    };

    const error = new AxiosError();
    error.response = mockResponse;

    const { login } = useAuthStore();
    const { user, authError } = storeToRefs(useAuthStore());

    vi.mocked(authService.login).mockRejectedValue(error);

    await login(loginDto);

    expect(authService.login).toHaveBeenCalledOnce();
    expect(user.value).toStrictEqual(emptyUser);
    expect(JSON.parse(localStorage.getItem('user') ?? '{}')).toStrictEqual({});
    expect(authError.value).toBe('Username and Password cannot be blank.');
  });

  it('should handle errors: 401 response status', async () => {
    const loginDto: LoginDto = {
      username: 'some_user',
      password: 'some_password',
    };

    const mockResponse: AxiosResponse<any, any> = {
      status: 401,
      data: undefined,
      statusText: '',
      headers: {},
      config: {} as any,
    };

    const error = new AxiosError();
    error.response = mockResponse;

    const { login } = useAuthStore();
    const { user, authError } = storeToRefs(useAuthStore());

    vi.mocked(authService.login).mockRejectedValue(error);

    await login(loginDto);

    expect(authService.login).toHaveBeenCalledOnce();
    expect(user.value).toStrictEqual(emptyUser);
    expect(JSON.parse(localStorage.getItem('user') ?? '{}')).toStrictEqual({});
    expect(authError.value).toBe('Your login attempt failed. Please try again.');
  });

  it('should handle errors: server errors', async () => {
    const loginDto: LoginDto = {
      username: 'some_user',
      password: 'some_password',
    };

    const mockResponse: AxiosResponse<any, any> = {
      status: 500,
      data: undefined,
      statusText: '',
      headers: {},
      config: {} as any,
    };

    const error = new AxiosError();
    error.response = mockResponse;

    const { login } = useAuthStore();
    const { user, authError } = storeToRefs(useAuthStore());

    vi.mocked(authService.login).mockRejectedValue(error);

    await login(loginDto);

    expect(authService.login).toHaveBeenCalledOnce();
    expect(user.value).toStrictEqual(emptyUser);
    expect(JSON.parse(localStorage.getItem('user') ?? '{}')).toStrictEqual({});
    expect(authError.value).toBe('Something went wrong on our end. Try again later.');
  });

  it('should handle errors: non-axios errors', async () => {
    const { login } = useAuthStore();
    const consoleSpy = vi.spyOn(console, 'error');

    const loginDto: LoginDto = {
      username: 'some_user',
      password: 'some_password',
    };

    vi.mocked(authService.login).mockRejectedValue(new Error("I'm an error!"));

    await login(loginDto);

    expect(consoleSpy).toHaveBeenCalledWith('Non-axios error:', expect.any(Error));
  });

  it('should logout a user and redirect to login', async () => {
    const { logout } = useAuthStore();
    const { user } = storeToRefs(useAuthStore());

    const mockUser: User = {
      username: 'some_user',
      roles: ['ROLE_USER'],
    };

    user.value = mockUser;
    localStorage.setItem('user', JSON.stringify(mockUser));

    logout();

    expect(JSON.parse(localStorage.getItem('user') ?? '{}')).toStrictEqual({});
    expect(user.value).toStrictEqual(emptyUser);
  });

  it('should retrieve a user from localstorage', async () => {
    const mockUser: User = {
      username: 'some_user',
      roles: ['ROLE_USER'],
    };

    const mockResponse: AxiosResponse<any, any> = {
      status: 200,
      data: { accessToken: 'some_token' },
      statusText: '',
      headers: {},
      config: {} as any,
    };

    vi.mocked(authService.refreshToken).mockResolvedValue(mockResponse);

    localStorage.setItem('user', JSON.stringify(mockUser));

    const { user } = storeToRefs(useAuthStore());

    await flushPromises();

    expect(user.value).toEqual(mockUser);
  });

  it('should logout if localstorage object is of different shape than emptyUser', async () => {
    const mockUser = {
      username: 'some_user',
    };

    const mockResponse: AxiosResponse<any, any> = {
      status: 200,
      data: { accessToken: 'some_token' },
      statusText: '',
      headers: {},
      config: {} as any,
    };

    vi.mocked(authService.refreshToken).mockResolvedValue(mockResponse);

    localStorage.setItem('user', JSON.stringify(mockUser));

    const { user } = storeToRefs(useAuthStore());

    await flushPromises();

    expect(user.value).toEqual(emptyUser);
  });

  it('should logout if localstorage object is malformed', async () => {
    const mockResponse: AxiosResponse<any, any> = {
      status: 200,
      data: { accessToken: 'some_token' },
      statusText: '',
      headers: {},
      config: {} as any,
    };

    vi.mocked(authService.refreshToken).mockResolvedValue(mockResponse);

    localStorage.setItem('user', '{"username": "some_user", "roles": ["ROLE_USER"], }');

    const { user } = storeToRefs(useAuthStore());

    await flushPromises();

    expect(user.value).toEqual(emptyUser);
  });

  it('should generate an empty user if localstorage is empty', () => {
    const { user } = storeToRefs(useAuthStore());

    expect(user.value).toEqual(emptyUser);
  });

  it('should clear auth error', () => {
    const { clearAuthError } = useAuthStore();
    const { authError } = storeToRefs(useAuthStore());

    authError.value = 'some error';

    clearAuthError();

    expect(authError.value).toBe('');
  });

  it('should attempt to refresh token and set axios headers', async () => {
    const mockResponse: AxiosResponse<any, any> = {
      status: 200,
      data: { accessToken: 'some_token' },
      statusText: '',
      headers: {},
      config: {} as any,
    };

    vi.mocked(authService.refreshToken).mockResolvedValue(mockResponse);

    const { attemptToRefreshToken } = useAuthStore();

    const config: RetryAxiosRequestConfig = {
      url: '/user',
      method: 'post',
      baseURL: 'https://some-domain.com/api/',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      timeout: 0,
      withCredentials: false,
      responseType: 'json',
      maxRedirects: 0,
    };

    attemptToRefreshToken(config);

    await flushPromises();

    expect(axios.defaults.headers.common.Authorization).toBe('Bearer some_token');
  });

  it('should attempt to refresh token and handle 403 response', async () => {
    const mockResponse: AxiosResponse<any, any> = {
      status: 403,
      data: undefined,
      statusText: '',
      headers: {},
      config: {} as any,
    };

    const error = new AxiosError();
    error.response = mockResponse;

    vi.mocked(authService.refreshToken).mockRejectedValue(error);

    const { attemptToRefreshToken } = useAuthStore();

    const config: RetryAxiosRequestConfig = {
      url: '/user',
      method: 'post',
      baseURL: 'https://some-domain.com/api/',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      timeout: 0,
      withCredentials: false,
      responseType: 'json',
      maxRedirects: 0,
    };

    const response = await attemptToRefreshToken(config);

    expect(response).toBe('logout successful');
  });
});
