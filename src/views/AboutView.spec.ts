import AboutView from '@/views/AboutView.vue';
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('AboutView.vue', () => {
  it('renders text', () => {
    const wrapper = shallowMount(AboutView);
    expect(wrapper.find('h1').text()).toBe('This is an about page');
  });
});
