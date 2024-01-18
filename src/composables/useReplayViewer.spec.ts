import { gameService } from '@/services/gameService';
import type { SuccessResponse } from '@/utils/makeRequest';
import { flushPromises } from '@vue/test-utils';
import { afterEach } from 'node:test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LocationQuery } from 'vue-router';
import { useReplayViewer } from './useReplayViewer';

const responseData = {
  map: 'ns_arena.txt',
  battleground:
    '010101010101010101010101010101010101010101 010101010101010100000000000101010101010101 010101010100000000000000000000000101010101 010101010000000000000000000000000001010101 010101000000000000000000000000000000010101 010100000000000000000000000000000000000101 010100000000000000001100000000000000000101 010100000000000000000000000000000000000101 010000000007000000000000000000310000000001 010000000000000000000000000000000000000001 010000000007000000000000000000310000000001 010000000000000000000000000000000000000001 010000000007000000000000000000310000000001 010100000000000000000000000000000000000101 010100000000000000001900000000000000000101 010100000000000000000000000000000000000101 010101000000000000000000000000000000010101 010101010000000000000000000000000001010101 010101010100000000000000000000000101010101 010101010101010100000000000101010101010101 010101010101010101010101010101010101010101 ',
  replay: [
    [
      {
        coords: {
          x: 5.0,
          y: 8.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 15.0,
          y: 12.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 5.0,
          y: 12.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 15.0,
          y: 8.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 5.0,
          y: 10.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 15.0,
          y: 10.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 10.0,
          y: 6.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 10.0,
          y: 14.0,
        },
        action: 10,
      },
    ],
    [
      {
        coords: {
          x: 6.0,
          y: 8.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 14.0,
          y: 12.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 6.0,
          y: 12.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 14.0,
          y: 8.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 6.0,
          y: 10.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 14.0,
          y: 10.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 10.0,
          y: 7.0,
        },
        action: 10,
      },
      {
        coords: {
          x: 10.0,
          y: 13.0,
        },
        action: 10,
      },
    ],
  ],
  swarms: [{ name: 'Pizza Rizza' }, { name: 'Strawberry Sizzle' }],
};

vi.mock('@/services/gameService');

describe('useReplayViewer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should assemble a replay', async () => {
    const locationQuery: LocationQuery = {
      m: 'ns_arena.txt',
      s: '1,2',
    };
    const mockResponse: SuccessResponse = {
      type: 'success',
      status: 200,
      data: responseData,
    };
    vi.mocked(gameService.getReplay).mockResolvedValue(mockResponse);

    const { frames } = await useReplayViewer(locationQuery);

    await flushPromises();

    expect(frames.value.length).toBe(3);
  });

  it('should update topBugs', async () => {
    const locationQuery: LocationQuery = {
      m: 'ns_arena.txt',
      s: '1,2',
    };
    const mockResponse: SuccessResponse = {
      type: 'success',
      status: 200,
      data: responseData,
    };
    vi.mocked(gameService.getReplay).mockResolvedValue(mockResponse);

    const { topBugs } = await useReplayViewer(locationQuery);

    await flushPromises();

    expect(topBugs.value).toStrictEqual([0, 1]);
  });

  it('should play the replay', async () => {
    const locationQuery: LocationQuery = {
      m: 'ns_arena.txt',
      s: '1,2',
    };
    const mockResponse: SuccessResponse = {
      type: 'success',
      status: 200,
      data: responseData,
    };
    vi.mocked(gameService.getReplay).mockResolvedValue(mockResponse);

    const { play, frameIndex } = await useReplayViewer(locationQuery);

    await flushPromises();

    play(500);
    vi.advanceTimersToNextTimer();

    expect(frameIndex.value).toBe(2);
  });

  it('should pause the replay', async () => {
    const locationQuery: LocationQuery = {
      m: 'ns_arena.txt',
      s: '1,2',
    };
    const mockResponse: SuccessResponse = {
      type: 'success',
      status: 200,
      data: responseData,
    };
    vi.mocked(gameService.getReplay).mockResolvedValue(mockResponse);

    const { play, pause, showPause, frameIndex } = await useReplayViewer(locationQuery);

    await flushPromises();

    play(500);
    vi.advanceTimersToNextTimer();
    pause();
    vi.advanceTimersToNextTimer();

    expect(frameIndex.value).toBe(2);
    expect(showPause.value).toBe(false);
  });

  it('should rewind the replay', async () => {
    const locationQuery: LocationQuery = {
      m: 'ns_arena.txt',
      s: '1,2',
    };
    const mockResponse: SuccessResponse = {
      type: 'success',
      status: 200,
      data: responseData,
    };
    vi.mocked(gameService.getReplay).mockResolvedValue(mockResponse);

    const { rewind, frameIndex } = await useReplayViewer(locationQuery);
    await flushPromises();

    frameIndex.value = 2;
    expect(frameIndex.value).toBe(2);

    rewind();

    expect(frameIndex.value).toBe(0);
  });

  it('should go to the next frame', async () => {
    const locationQuery: LocationQuery = {
      m: 'ns_arena.txt',
      s: '1,2',
    };
    const mockResponse: SuccessResponse = {
      type: 'success',
      status: 200,
      data: responseData,
    };
    vi.mocked(gameService.getReplay).mockResolvedValue(mockResponse);

    const { nextFrame, frameIndex } = await useReplayViewer(locationQuery);
    await flushPromises();

    expect(frameIndex.value).toBe(0);
    nextFrame();
    expect(frameIndex.value).toBe(1);
    nextFrame();
    expect(frameIndex.value).toBe(2);
  });

  it('should go to the previous frame', async () => {
    const locationQuery: LocationQuery = {
      m: 'ns_arena.txt',
      s: '1,2',
    };
    const mockResponse: SuccessResponse = {
      type: 'success',
      status: 200,
      data: responseData,
    };
    vi.mocked(gameService.getReplay).mockResolvedValue(mockResponse);

    const { prevFrame, frameIndex } = await useReplayViewer(locationQuery);
    await flushPromises();

    frameIndex.value = 2;
    expect(frameIndex.value).toBe(2);
    prevFrame();
    expect(frameIndex.value).toBe(1);
    prevFrame();
    expect(frameIndex.value).toBe(0);
  });
});
