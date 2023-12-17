import App from '@/App.vue';
import HelloWorld from '@/components/HelloWorld.vue';
import { RouterLinkStub, shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('App.vue', () => {
  it('renders HelloWorld component', () => {
    const wrapper = shallowMount(App, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });
    expect(wrapper.findComponent(HelloWorld).exists()).toBe(true);
  });
});
