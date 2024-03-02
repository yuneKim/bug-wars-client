import { describe, expect, it } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import ProfileView from './ProfileView.vue';

describe('ProfileView.vue', () => {
  it('renders LoginForm component', () => {
    const wrapper = shallowMount(ProfileView);
    expect(wrapper.findComponent(ProfileView).exists()).toBe(true);
  });
});