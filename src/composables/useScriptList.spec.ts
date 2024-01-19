import { scriptService } from '@/services/scriptService';
import { flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScriptList } from './useScriptList';

vi.mock('@/services/scriptService');

describe('useScriptList.ts', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('sets error message when unable to delete script', async () => {
    vi.mocked(scriptService.deleteScriptById).mockResolvedValue({
      type: 'error',
      status: 500,
      error: 'bad message',
    });

    const { errorMessage, deleteScript } = useScriptList();

    await deleteScript();
    await flushPromises();
    expect(errorMessage.value).toBe('bad message');
  });

  it('loads remaining scripts after deleting a script', async () => {
    vi.mocked(scriptService.getAllScripts).mockResolvedValue({
      type: 'success',
      status: 200,
      data: [],
    });

    vi.mocked(scriptService.deleteScriptById).mockResolvedValue({
      type: 'success',
      status: 204,
      data: 'A message',
    });

    const { deleteScript } = useScriptList();

    await deleteScript();
    await flushPromises();
    expect(scriptService.getAllScripts).toBeCalled();
  });
});
