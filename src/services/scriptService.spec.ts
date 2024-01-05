import type { ParseDto } from '@/types';
import { makeRequest, type SuccessResponse } from '@/utils/makeRequest';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { scriptService } from './scriptService';

vi.mock('axios');
vi.mock('@/utils/makeRequest');

describe('authService', () => {
  it('makes a POST request to parse a script', async () => {
    const parseDto: ParseDto = {
      code: 'some_script',
    };

    const mockSuccessResponse: SuccessResponse = {
      type: 'success',
      status: 201,
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

    const registerResponse = await scriptService.parse(parseDto);

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), parseDto);
    expect(registerResponse).toStrictEqual(mockSuccessResponse);
  });

  it('makes a GET request to get all scripts', async () => {
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

    vi.mocked(axios.get).mockResolvedValue({
      data: mockResponse,
    });

    const registerResponse = await scriptService.getAllScripts();

    expect(axios.get).toHaveBeenCalledWith(expect.any(String));
    expect(registerResponse).toStrictEqual(mockSuccessResponse);
  });

  it('makes a GET request to get a script by id', async () => {
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

    vi.mocked(axios.get).mockResolvedValue({
      data: mockResponse,
    });

    const registerResponse = await scriptService.getScriptById(1);

    expect(axios.get).toHaveBeenCalledWith(expect.any(String));
    expect(registerResponse).toStrictEqual(mockSuccessResponse);
  });
});
