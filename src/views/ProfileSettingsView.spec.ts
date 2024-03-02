import { describe, expect, it } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import ProfileSettingsView from './ProfileSettingsView.vue';

describe('ProfileSettingsView.vue', () => {
  it('renders LoginForm component', () => {
    const wrapper = shallowMount(ProfileSettingsView);
    expect(wrapper.findComponent(ProfileSettingsView).exists()).toBe(true);
  });
});