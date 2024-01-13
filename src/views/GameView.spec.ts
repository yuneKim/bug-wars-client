import TheGame from '@/components/game/TheGame.vue';
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import GameView from './GameView.vue';

describe('GameView.vue', () => {
  it('renders TheGame component', () => {
    const wrapper = shallowMount(GameView);
    expect(wrapper.findComponent(TheGame).exists()).toBe(true);
  });
});
