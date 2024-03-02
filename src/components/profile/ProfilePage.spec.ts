import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProfilePage from './ProfilePage.vue';

describe('ProfilePage.vue', () => {
  it('displays text', () => {
    const wrapper = shallowMount(ProfilePage);
    expect(wrapper.find('h1').text()).toBe('User Profile');
  });
});