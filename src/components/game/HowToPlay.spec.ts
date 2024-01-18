import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HowToPlay from './HowToPlay.vue';

describe('HowToPlay.vue', () => {
  it('displays text', () => {
    const wrapper = shallowMount(HowToPlay);
    expect(wrapper.find('h1').text()).toBe('HOW TO PLAY');
  });
});
