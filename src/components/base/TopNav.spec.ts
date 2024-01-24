import TopNav from '@/components/base/TopNav.vue';
import { createTestingPinia } from '@pinia/testing';
import { RouterLinkStub, shallowMount, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/stores/auth';

describe('TopNav.vue', () => {
  it('renders nav element', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    const authStore = useAuthStore(pinia);
    authStore.user = {
      username: 'some_user',
      roles: ['some_role'],
    };

    const wrapper = shallowMount(TopNav, {
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

    const wrapper = shallowMount(TopNav, {
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

    const wrapper = shallowMount(TopNav, {
      global: {
        plugins: [pinia],
      },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });

    expect(wrapper.find('.logout').exists()).toBe(true);
  });

  it("shows nav links when hamburger button is clicked", async () => {
    const wrapper = shallowMount(TopNav, {
      attachTo: document.body
    })

    await wrapper.find('[data-test="hamburger-button"]').trigger('click');
    expect(wrapper.find('[data-test="nav-links"]').isVisible()).toBe(true);
  });

  it("hides nav links when x button is clicked", async () => {
    const wrapper = shallowMount(TopNav, {
      attachTo: document.body
    })
    await wrapper.find('[data-test="hamburger-button"]').trigger('click');
    expect(wrapper.find('[data-test="nav-links"]').isVisible()).toBe(true);
    expect(wrapper.find('[data-test="x-button"]').isVisible()).toBe(true);
    await wrapper.find('[data-test="x-button"]').trigger('click');
    expect(wrapper.find('[data-test="nav-links"]').isVisible()).toBe(true);
  });
});
