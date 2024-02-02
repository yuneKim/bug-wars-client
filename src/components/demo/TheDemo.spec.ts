import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TheDemoVue from './TheDemo.vue';

describe('HowToPlay.vue', () => {
  it('displays text', () => {
    const wrapper = shallowMount(TheDemoVue);
    expect(wrapper.find('h1').text()).toBe('DEMO VIDEO');
  });
  it('displays a video', () => {
    const wrapper = shallowMount(TheDemoVue);
    expect(wrapper.find('iframe').exists());
  });
});
