import { useAuthStore } from '@/stores/auth';
import type { LoginDto } from '@/types';
import { createTestingPinia } from '@pinia/testing';
import { shallowMount, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import LoginForm from './LoginForm.vue';
import Password from 'primevue/password';
import PrimeVue from 'primevue/config';

describe('LoginForm.vue', () => {
  it('has form inputs', () => {
    const wrapper = shallowMount(LoginForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });
    expect(wrapper.find('#username').exists()).toBe(true);
    expect(wrapper.find('#password').exists()).toBe(true);
  });

  it('calls login on form submit', async () => {
    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);

    const wrapper = mount(LoginForm, {
      attachTo: '#root',
      global: {
        components: {
          Password
      },
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          PrimeVue
        ],
      },
    });

    const store = useAuthStore();

    const loginDto: LoginDto = {
      username: 'some_user',
      password: 'some_password',
    };

    const usernameInput = wrapper.find('#username');
    await usernameInput.setValue(loginDto.username);
    const passwordComponent = wrapper.find('#password');
    const passwordInput = passwordComponent.find('input');
    await passwordInput.setValue(loginDto.password);
   
    expect((usernameInput.element as HTMLInputElement).value).toBe(loginDto.username);
    expect((passwordInput.element as HTMLInputElement).value).toBe(loginDto.password);

    await wrapper.find('button').trigger('click');

    expect(store.login).toHaveBeenLastCalledWith(loginDto);
    wrapper.unmount();
  });

  it('validates data on form submit', async () => {
    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);

    const wrapper = mount(LoginForm, {
      attachTo: '#root',
      global: {
        components: {
          Password
        },
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          PrimeVue
        ],
      },
    });

    const store = useAuthStore();

    const usernameInput = wrapper.find('#username');
    await usernameInput.setValue('');
    await wrapper.find('button').trigger('click');

    expect(store.login).toHaveBeenCalledTimes(0);
    expect(wrapper.find('.login-error').exists()).toBe(true);

    await usernameInput.setValue('test_user');
    const passwordComponent = wrapper.find('#password');
    const passwordInput = passwordComponent.find('input');
    await passwordInput.setValue('');
    await wrapper.find('button').trigger('click');

    expect(store.login).toHaveBeenCalledTimes(0);
    expect(wrapper.find('.login-error').exists()).toBe(true);

    wrapper.unmount();
  });
});
