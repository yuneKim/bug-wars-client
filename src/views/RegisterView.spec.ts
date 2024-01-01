import { describe, expect, it } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import RegisterView from './RegisterView.vue';

describe('RegisterView.vue', () => {
  it('renders RegisterForm component', () => {
    const wrapper = shallowMount(RegisterView);
    expect(wrapper.findComponent(RegisterView).exists()).toBe(true);
  });
});