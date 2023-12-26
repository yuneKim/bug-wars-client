import { describe, expect, it } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import LoginView from './LoginView.vue';

describe('LoginView.vue', () => {
  it('renders LoginForm component', () => {
    const wrapper = shallowMount(LoginView);
    expect(wrapper.findComponent(LoginView).exists()).toBe(true);
  });
});
