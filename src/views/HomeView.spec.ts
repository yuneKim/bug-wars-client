import { describe, expect, it } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import HomeView from './HomeView.vue';

describe('HomeView', () => {
  it('renders properly', () => {
    const wrapper = shallowMount(HomeView);
    expect(wrapper.find('main').text()).toBe('Home View');
  });
});
