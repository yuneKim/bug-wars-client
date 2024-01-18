import TheGame from '@/components/game/TheGame.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import GameView from './GameView.vue';

describe('GameView.vue', () => {
  it('renders TheGame component', async () => {
    const TestComponent = defineComponent({
      components: { GameView },
      template: '<Suspense><GameView /></Suspense>',
    });
    const wrapper = mount(TestComponent, {
      shallow: true,
      global: {
        stubs: { Suspense: false, GameView: false, Button: false },
      },
    });
    await flushPromises();

    expect(wrapper.findComponent(TheGame).exists()).toBe(true);
  });
});
