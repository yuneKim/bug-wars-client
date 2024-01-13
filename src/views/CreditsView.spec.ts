import TheCredits from '@/components/game/TheCredits.vue';
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CreditsView from './CreditsView.vue';

describe('CreditsView.vue', () => {
  it('renders TheCredits component', () => {
    const wrapper = shallowMount(CreditsView);
    expect(wrapper.findComponent(TheCredits).exists()).toBe(true);
  });
});
