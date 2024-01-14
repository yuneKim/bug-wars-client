import { authService } from '@/services/authService';
import type { RegisterDto } from '@/types';
import { mount, shallowMount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import RegisterForm from './RegisterForm.vue';

vi.mock('@/services/authService');
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));
vi.mock('@/utils/makeRequest');

describe('RegisterForm.vue', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders register form', () => {
    const wrapper = shallowMount(RegisterForm);
    expect(wrapper.findComponent(RegisterForm).exists()).toBe(true);
  });

  it('has form inputs', () => {
    const wrapper = shallowMount(RegisterForm);
    expect(wrapper.find('#username').exists()).toBe(true);
    expect(wrapper.find('#password').exists()).toBe(true);
    expect(wrapper.find('#confirm-password').exists()).toBe(true);
    expect(wrapper.find('#email').exists()).toBe(true);
  });

  it('calls register on form submit', async () => {
    const wrapper = mount(RegisterForm);

    const registerDto: RegisterDto = {
      username: 'some_user',
      password: 'some_password',
      email: 'some_email',
    };

    vi.mocked(authService.register).mockResolvedValue({
      type: 'success',
      status: 20,
      data: 'A message',
    });

    const usernameInput = wrapper.find('#username');
    await usernameInput.setValue(registerDto.username);
    const passwordInput = wrapper.find('#password');
    await passwordInput.setValue(registerDto.password);
    const confirmPasswordInput = wrapper.find('#confirm-password');
    await confirmPasswordInput.setValue(registerDto.password);
    const emailInput = wrapper.find('#email');
    await emailInput.setValue(registerDto.email);

    expect((usernameInput.element as HTMLInputElement).value).toBe(registerDto.username);
    expect((passwordInput.element as HTMLInputElement).value).toBe(registerDto.password);
    expect((emailInput.element as HTMLInputElement).value).toBe(registerDto.email);

    await wrapper.find('form').trigger('submit');

    expect(authService.register).toHaveBeenCalledOnce();
  });

  it('handles errors with message', async () => {
    const wrapper = mount(RegisterForm);

    const registerDto: RegisterDto = {
      username: 'some_user',
      password: 'some_password',
      email: 'some_email',
    };

    vi.mocked(authService.register).mockResolvedValue({
      type: 'error',
      status: 400,
      error: 'A message',
    });

    const usernameInput = wrapper.find('#username');
    await usernameInput.setValue(registerDto.username);
    const passwordInput = wrapper.find('#password');
    await passwordInput.setValue(registerDto.password);
    const confirmPasswordInput = wrapper.find('#confirm-password');
    await confirmPasswordInput.setValue(registerDto.password);
    const emailInput = wrapper.find('#email');
    await emailInput.setValue(registerDto.email);

    await wrapper.find('form').trigger('submit');

    await nextTick();

    expect(wrapper.find('.error-message').text()).toBe('A message');
  });

  it('validates data on form submit', async () => {
    const wrapper = mount(RegisterForm);

    const usernameInput = wrapper.find('#username');
    const passwordInput = wrapper.find('#password');
    const confirmPasswordInput = wrapper.find('#confirm-password');

    await usernameInput.setValue('Yo');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('.error-message').text()).toBe(
      'Username must be at least 3 characters long.',
    );

    await usernameInput.setValue('Bob');
    await passwordInput.setValue('test');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('.error-message').text()).toBe(
      'Password must be at least 6 characters long.',
    );

    await passwordInput.setValue('password');
    await confirmPasswordInput.setValue('PASSWORD');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('.error-message').text()).toBe('Passwords do not match.');
  });
});
