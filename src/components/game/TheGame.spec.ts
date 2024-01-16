import { useReplayViewer } from '@/composables/useReplayViewer';
import type { BattleGrid } from '@/utils/replayUnsquasher';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, ref, type Ref } from 'vue';
import TheGame from './TheGame.vue';

vi.mock('@/composables/useReplayViewer');
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ query: { m: 'test', s: '1,1' } })),
}));

describe('TheGame', () => {
  it('should display scores', async () => {
    vi.mocked(useReplayViewer).mockImplementation(async () => {
      return Promise.resolve({
        frames: ref([]) as Ref<BattleGrid[]>,
        frameIndex: ref(0),
        rewind: vi.fn(),
        play: vi.fn(),
        pause: vi.fn(),
        showPause: ref(false),
        prevFrame: vi.fn(),
        nextFrame: vi.fn(),
        scoreboard: ref({
          0: {
            scores: [],
          },
          1: {
            scores: [],
          },
        }),
        topBugs: ref([0, 1]),
      }) as any;
    });

    const TestComponent = defineComponent({
      components: { TheGame },
      template: '<Suspense><TheGame /></Suspense>',
    });
    const wrapper = mount(TestComponent, {
      shallow: true,
      global: {
        stubs: { Suspense: false, TheGame: false, Button: false },
      },
    });

    await flushPromises();

    expect(wrapper.findAll('[data-test="score"]').length).toBe(2);
  });

  it('should control game replay on button presses', async () => {
    const mockPlay = vi.fn();
    const mockPause = vi.fn();
    const mockShowPause = ref(false);

    vi.mocked(useReplayViewer).mockImplementation(() => {
      return {
        frames: ref([]) as Ref<BattleGrid[]>,
        frameIndex: ref(0),
        rewind: vi.fn(),
        play: mockPlay,
        pause: mockPause,
        showPause: mockShowPause,
        prevFrame: vi.fn(),
        nextFrame: vi.fn(),
        scoreboard: ref({
          0: {
            scores: [],
          },
          1: {
            scores: [],
          },
        }),
        topBugs: ref([0, 1]),
      } as any;
    });
    const TestComponent = defineComponent({
      components: { TheGame },
      template: '<Suspense><TheGame /></Suspense>',
    });
    const wrapper = mount(TestComponent, {
      shallow: true,
      global: {
        stubs: { Suspense: false, TheGame: false, Button: false },
      },
    });

    await flushPromises();

    vi.mocked(mockPlay).mockImplementation(() => (mockShowPause.value = true));
    vi.mocked(mockPause).mockImplementation(() => (mockShowPause.value = false));
    expect(wrapper.find("[data-test='pause-button']").exists()).toBe(false);
    await wrapper.find('[data-test="play-button"]').trigger('click');
    expect(wrapper.find("[data-test='pause-button']").exists()).toBe(true);
    await wrapper.find('[data-test="ff-button"]').trigger('click');
    await wrapper.find('[data-test="fff-button"]').trigger('click');
    expect(mockPlay).toHaveBeenCalledTimes(3);
    expect(wrapper.find("[data-test='play-button']").exists()).toBe(false);
    await wrapper.find('[data-test="pause-button"]').trigger('click');
    expect(wrapper.find("[data-test='play-button']").exists()).toBe(true);
  });
});
