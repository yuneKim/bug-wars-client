import { makeRequest, type ErrorResponse, type SuccessResponse } from '@/utils/makeRequest';
import { describe, expect, it, vi } from 'vitest';
import { useCompiler } from './useCompiler';

vi.mock('@/utils/makeRequest');

describe('useCompiler', () => {
  it('should compile the script', async () => {
    const { output, compileScript } = useCompiler();

    const mockResponse: SuccessResponse = {
      type: 'success',
      status: 200,
      data: [1, 2, 3],
    };

    vi.mocked(makeRequest).mockResolvedValue(mockResponse);

    await compileScript('some_script');

    expect(output.value).toStrictEqual(JSON.stringify(mockResponse.data));
  });

  it('should set the error when the script fails to compile', async () => {
    const { output, compileScript } = useCompiler();

    const mockResponse: ErrorResponse = {
      type: 'error',
      status: 422,
      error: 'Some Error',
    };

    vi.mocked(makeRequest).mockResolvedValue(mockResponse);

    await compileScript('some_script');

    expect(output.value).toStrictEqual(mockResponse.error);
  });
});
