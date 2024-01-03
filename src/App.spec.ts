import App from '@/App.vue';
import { createTestingPinia } from '@pinia/testing';
import { RouterLinkStub, shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { useAuthStore } from './stores/auth';

describe('App.vue', () => {
  it('renders nav element', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    const authStore = useAuthStore(pinia);
    authStore.user = {
      username: 'some_user',
      roles: ['some_role'],
    };

    const wrapper = shallowMount(App, {
      global: {
        plugins: [pinia],
      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });

    expect(wrapper.find('nav').exists()).toBe(true);
  });

  it('renders nav element with login link', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    const authStore = useAuthStore(pinia);
    authStore.user = {
      username: '',
      roles: [],
    };

    const wrapper = shallowMount(App, {
      global: {
        plugins: [pinia],
      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });

    expect(wrapper.find('.login').exists()).toBe(true);
  });

  it('renders nav element with logout link', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    const authStore = useAuthStore(pinia);
    authStore.user = {
      username: 'ferrington',
      roles: [],
    };

    const wrapper = shallowMount(App, {
      global: {
        plugins: [pinia],
      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });

    expect(wrapper.find('.logout').exists()).toBe(true);
  });
});
