import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProfileSettings from './ProfileSettings.vue';

describe('ProfileSettings.vue', () => {
  it('displays text', () => {
    const wrapper = shallowMount(ProfileSettings);
    expect(wrapper.find('h1').text()).toBe('Profile Settings');
  });
});