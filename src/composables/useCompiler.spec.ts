import { scriptService } from '@/services/scriptService';
import { type ErrorResponse, type SuccessResponse } from '@/utils/makeRequest';
import { describe, expect, it, vi } from 'vitest';
import { useCompiler } from './useCompiler';

vi.mock('@/services/scriptService');

describe('useCompiler', () => {
  it('should compile the script', async () => {
    const { output, compileScript } = useCompiler();

    const mockResponse: SuccessResponse = {
      type: 'success',
      status: 200,
      data: [1, 2, 3],
    };

    vi.mocked(scriptService.parse).mockResolvedValue(mockResponse);

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

    vi.mocked(scriptService.parse).mockResolvedValue(mockResponse);

    await compileScript('some_script');

    expect(output.value).toStrictEqual(mockResponse.error);
  });

  it('should set the output', () => {
    const { output, setOutput } = useCompiler();

    const input = '[1,2,3]';
    setOutput(input);

    expect(output.value).toStrictEqual(input);
  });
});
