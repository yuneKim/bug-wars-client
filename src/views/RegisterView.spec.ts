import { describe, expect, it } from 'vitest';

import RegisterForm from '@/components/auth/RegisterForm.vue';
import { shallowMount } from '@vue/test-utils';
import RegisterView from './RegisterView.vue';

describe('RegisterView.vue', () => {
  it('renders RegisterForm component', () => {
    const wrapper = shallowMount(RegisterView);
    expect(wrapper.findComponent(RegisterForm).exists()).toBe(true);
  });
});
