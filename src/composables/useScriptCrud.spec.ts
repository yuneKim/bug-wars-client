import { scriptService } from '@/services/scriptService';
import type { SuccessResponse } from '@/utils/makeRequest';
import { flushPromises } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { useScriptCrud } from './useScriptCrud';

vi.mock('@/services/scriptService');

describe('useScriptCrud', () => {
  it('validates a script name', () => {
    const editorText = ref('');
    const route: RouteLocationNormalizedLoaded = {
      matched: [],
      fullPath: '',
      query: {},
      hash: '',
      redirectedFrom: undefined,
      name: undefined,
      path: '',
      params: {},
      meta: {},
    };
    const setText = vi.fn();
    const setOutput = vi.fn();
    const { script, validateScriptName, errorMessage } = useScriptCrud({
      editorText,
      route,
      setText,
      setOutput,
    });

    script.value.name = 'Oggie Boogie';
    let isValid = validateScriptName();
    expect(isValid).toBeTruthy();

    script.value.name = '';
    isValid = validateScriptName();
    expect(isValid).toBeFalsy();

    expect(errorMessage.value).toBe('Script name may not be blank.');
  });

  it('creates a script', async () => {
    const mockSuccessResponse: SuccessResponse = {
      type: 'success',
      status: 201,
      data: 'A message',
    };
    const editorText = ref('');
    const route: RouteLocationNormalizedLoaded = {
      matched: [],
      fullPath: '',
      query: {},
      hash: '',
      redirectedFrom: undefined,
      name: undefined,
      path: '',
      params: {},
      meta: {},
    };
    const setText = vi.fn();
    const setOutput = vi.fn();
    const { script, save, successMessage } = useScriptCrud({
      editorText,
      route,
      setText,
      setOutput,
    });

    script.value.id = -1;
    script.value.name = 'Oggie Boogie';
    script.value.raw = 'I really hate tests';

    vi.mocked(scriptService.createScript).mockResolvedValue(mockSuccessResponse);
    save();
    await flushPromises();
    expect(successMessage.value).toBe('Saved!');
  });
});
