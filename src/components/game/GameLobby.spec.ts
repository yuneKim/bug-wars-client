import { shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import GameLobby from './GameLobby.vue';

const mockPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
}));

describe('GameLobby.vue', () => {
  it('selects swarms', async () => {
    const wrapper = shallowMount(GameLobby);

    await wrapper.find('[data-test="swarm-select"]').setValue('2');
    expect((wrapper.find('[data-test="swarm-select"]').element as HTMLSelectElement).value).toBe(
      '2',
    );
  });

  it("starts a game when 'Start Game' is clicked", async () => {
    const wrapper = shallowMount(GameLobby);

    await wrapper.find('[data-test="start-game"]').trigger('click');
    expect(mockPush).toHaveBeenCalled();
  });
});
