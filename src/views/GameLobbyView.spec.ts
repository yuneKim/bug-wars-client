import GameLobby from '@/components/game/GameLobby.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import GameLobbyView from './GameLobbyView.vue';

describe('GameLobbyView.vue', () => {
  it('renders GameLobby component', async () => {
    const TestComponent = defineComponent({
      components: { GameLobbyView },
      template: '<Suspense><GameLobbyView /></Suspense>',
    });
    const wrapper = mount(TestComponent, {
      shallow: true,
      global: {
        stubs: { Suspense: false, GameLobbyView: false, Button: false },
      },
    });
    await flushPromises();
    expect(wrapper.findComponent(GameLobby).exists()).toBe(true);
  });
});
