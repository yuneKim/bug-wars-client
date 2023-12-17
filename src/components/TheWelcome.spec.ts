import TheWelcome from '@/components/TheWelcome.vue';
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('TheWelcome.vue', () => {
  it('renders welcome', () => {
    const wrapper = shallowMount(TheWelcome);
    expect(wrapper.text()).toBe('Welcome');
  });
});
