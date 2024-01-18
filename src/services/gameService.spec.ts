import { makeRequest, type SuccessResponse } from '@/utils/makeRequest';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { gameService } from './gameService';

vi.mock('axios');
vi.mock('@/utils/makeRequest');

describe('gameService', () => {
  it('makes a GET request to get all maps', async () => {
    const mockSuccessResponse: SuccessResponse = {
      type: 'success',
      status: 200,
      data: 'A message',
    };

    vi.mocked(makeRequest).mockImplementation(async (func: Function) => {
      func();
      return Promise.resolve(mockSuccessResponse);
    });

    const mockResponse = [35, 0];

    vi.mocked(axios.post).mockResolvedValue({
      data: mockResponse,
    });

    const registerResponse = await gameService.getMaps();

    expect(axios.get).toHaveBeenCalledOnce();
    expect(registerResponse).toStrictEqual(mockSuccessResponse);
  });

  it('makes a POST request to get a replay', async () => {
    const playGameDto = {
      scriptIds: [1, 2],
      mapId: 1,
    };

    const mockSuccessResponse: SuccessResponse = {
      type: 'success',
      status: 200,
      data: 'A message',
    };

    vi.mocked(makeRequest).mockImplementation(async (func: Function) => {
      func();
      return Promise.resolve(mockSuccessResponse);
    });

    const mockResponse = [35, 0];

    vi.mocked(axios.post).mockResolvedValue({
      data: mockResponse,
    });

    const registerResponse = await gameService.getReplay(playGameDto);

    expect(axios.post).toHaveBeenCalledOnce();
    expect(registerResponse).toStrictEqual(mockSuccessResponse);
  });
});
