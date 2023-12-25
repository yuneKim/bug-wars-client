import { authService } from '@/services/authService';
import type { LoginDto, User } from '@/types';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { useAuthStore } from './auth';

vi.mock('@/services/authService');
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));
vi.mock('jwt-decode');

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
      token: 'a token',
      type: 'Bearer',
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
    expect(axios.defaults.headers.common.Authorization).toBe(`Bearer ${mockUser.token}`);
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
    expect(user.value).toStrictEqual({ token: '', type: '', username: '', roles: [] });
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
    expect(user.value).toStrictEqual({ token: '', type: '', username: '', roles: [] });
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
    expect(user.value).toStrictEqual({ token: '', type: '', username: '', roles: [] });
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
      token: 'a token',
      type: 'Bearer',
      username: 'some_user',
      roles: ['ROLE_USER'],
    };

    const emptyUser: User = {
      token: '',
      type: '',
      username: '',
      roles: [],
    };

    user.value = mockUser;
    localStorage.setItem('user', JSON.stringify(mockUser));

    logout();

    expect(JSON.parse(localStorage.getItem('user') ?? '{}')).toStrictEqual({});
    expect(user.value).toStrictEqual(emptyUser);
  });

  it('should retrieve a user from localstorage', () => {
    const mockUser: User = {
      token: 'a token',
      type: 'Bearer',
      username: 'some_user',
      roles: ['ROLE_USER'],
    };

    localStorage.setItem('user', JSON.stringify(mockUser));

    const { user } = storeToRefs(useAuthStore());

    expect(user.value).toEqual(mockUser);
  });

  it('should generate an empty user if localstorage is empty', () => {
    const emptyUser: User = {
      token: '',
      type: '',
      username: '',
      roles: [],
    };

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

  it('should automatically logout a user', async () => {
    const { user } = storeToRefs(useAuthStore());

    vi.mocked(jwtDecode).mockReturnValue({ exp: Date.now() / 1000 - 1 });

    const mockUser: User = {
      token: 'a token',
      type: 'Bearer',
      username: 'some_user',
      roles: ['ROLE_USER'],
    };

    const emptyUser: User = {
      token: '',
      type: '',
      username: '',
      roles: [],
    };

    user.value = mockUser;

    // needed to wait for watch to update
    await nextTick();
    // needed to wait for setTimeout to run
    vi.runAllTimers();

    expect(JSON.parse(localStorage.getItem('user') ?? '{}')).toStrictEqual({});
    expect(user.value).toStrictEqual(emptyUser);

    vi.mocked(jwtDecode).mockReturnValue({ exp: null });

    await nextTick();

    user.value = mockUser;

    await nextTick();

    // make sure we don't try and logout if exp is null
    expect(vi.getTimerCount()).toBe(0);
  });
});
