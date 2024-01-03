import { describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/stores/auth';
import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';
import HomeView from './HomeView.vue';

describe('HomeView', () => {
  it('renders properly', () => {
    const wrapper = shallowMount(HomeView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    expect(wrapper.find('main').text()).toBe('Please log in.');
  });

  it('renders call to log in', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    const authStore = useAuthStore(pinia);
    authStore.user = {
      username: '',
      roles: [],
    };

    const wrapper = shallowMount(HomeView, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.find('main').text()).toBe('Please log in.');
  });

  it('renders greeting', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    const authStore = useAuthStore(pinia);
    authStore.user = {
      username: 'ferrington',
      roles: [],
    };

    const wrapper = shallowMount(HomeView, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.find('main').text()).toBe(`Welcome, ${authStore.user.username}!`);
  });
});
