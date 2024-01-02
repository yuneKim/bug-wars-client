import type { ParseDto } from '@/types';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { scriptService } from './scriptService';

vi.mock('axios');

describe('authService', () => {
  it('makes a POST request to parse a script', async () => {
    const parseDto: ParseDto = {
      code: 'some_script',
    };

    const mockResponse = [35, 0];

    vi.mocked(axios.post).mockResolvedValue({
      data: mockResponse,
    });

    const registerResponse = (await scriptService.parse(parseDto)).data;

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), parseDto);
    expect(registerResponse).toStrictEqual(mockResponse);
  });
});
