import { gameService } from '@/services/gameService';
import { scriptService } from '@/services/scriptService';
import type { ErrorResponse } from '@/utils/makeRequest';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import GameLobby from './GameLobby.vue';

const mockPush = vi.fn();

vi.mock('@/services/scriptService');
vi.mock('@/services/gameService');
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
}));

describe('GameLobby.vue', () => {
  it("starts a game when 'Start Game' is clicked", async () => {
    const mockErrorResponse: ErrorResponse = {
      type: 'error',
      status: 200,
      error: 'A message',
    };
    vi.mocked(gameService.getMaps).mockResolvedValue(mockErrorResponse);
    vi.mocked(scriptService.getAllNamesOfValidScripts).mockResolvedValue(mockErrorResponse);

    const TestComponent = defineComponent({
      components: { GameLobby },
      template: '<Suspense><GameLobby /></Suspense>',
    });

    const wrapper = mount(TestComponent, {
      shallow: true,
      global: {
        stubs: { Suspense: false, GameLobby: false, Button: false },
      },
    });
    await flushPromises();

    await wrapper.find('[data-test="start-game"]').trigger('click');
    expect(mockPush).toHaveBeenCalled();
  });
});
