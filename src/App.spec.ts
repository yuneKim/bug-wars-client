import App from '@/App.vue';
import { RouterLinkStub, shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('App.vue', () => {
  it('renders nav element', () => {
    const wrapper = shallowMount(App, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });
    expect(wrapper.find('nav').exists()).toBe(true);
  });
});
