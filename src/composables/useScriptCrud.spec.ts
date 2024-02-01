import { scriptService } from '@/services/scriptService';
import type { ErrorResponse, SuccessResponse } from '@/utils/makeRequest';
import { flushPromises } from '@vue/test-utils';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useScriptCrud } from './useScriptCrud';

type TestRoute = {
  params: {
    id: number | string;
  };
};

const route: TestRoute = {
  params: {
    id: 'a',
  },
};

vi.mock('vue-router', () => {
  return {
    useRoute: vi.fn(() => route),
  };
});
vi.mock('@/services/scriptService');

describe('useScriptCrud', () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  it('validates a script name', () => {
    const editorText = ref('');
    const setOutput = vi.fn();
    const { script, validateScriptName, errorMessage } = useScriptCrud({
      editorText,
      setOutput,
    });

    script.value.name = 'Oggie Boogie';
    let isValid = validateScriptName();
    expect(isValid).toBeTruthy();

    script.value.name = '';
    isValid = validateScriptName();
    expect(isValid).toBeFalsy();

    expect(errorMessage.value).toBe('Script name may not be blank.');

    script.value.name = 'fucking strawberries';
    isValid = validateScriptName();
    expect(isValid).toBeFalsy();
    expect(errorMessage.value).toBe('Script name may not contain inappropriate language.');
  });

  it('creates a script', async () => {
    const mockSuccessResponse: SuccessResponse = {
      type: 'success',
      status: 201,
      data: { id: 1 },
    };
    const editorText = ref('');
    const setOutput = vi.fn();
    const { script, save, successMessage } = useScriptCrud({
      editorText,
      setOutput,
    });

    script.value.id = -1;
    script.value.name = 'Oggie Boogie';
    editorText.value = 'I really hate tests';

    vi.mocked(scriptService.createScript).mockResolvedValue(mockSuccessResponse);
    save();
    await flushPromises();
    expect(successMessage.value).toBe('Saved!');
  });

  it('gives an error on empty script body', async () => {
    const editorText = ref('');
    const setOutput = vi.fn();
    const { script, save, errorMessage } = useScriptCrud({
      editorText,
      setOutput,
    });

    script.value.id = -1;
    script.value.name = 'Oggie Boogie';
    editorText.value = '';

    save();
    await flushPromises();
    expect(errorMessage.value).toBe('Script body may not be blank.');
  });

  it('sets an error message when unable to create script', async () => {
    const mockErrorResponse: ErrorResponse = {
      type: 'error',
      status: 500,
      error: 'unhappy',
    };
    const editorText = ref('');
    const setOutput = vi.fn();
    const { script, save, errorMessage } = useScriptCrud({
      editorText,
      setOutput,
    });

    script.value.id = -1;
    script.value.name = 'Oggie Boogie';
    editorText.value = 'hello world';

    vi.mocked(scriptService.createScript).mockResolvedValue(mockErrorResponse);
    save();
    await flushPromises();
    expect(errorMessage.value).toBe(mockErrorResponse.error);
  });

  it('loads a script successfully', async () => {
    route.params.id = 1;
    const mockSuccessResponse: SuccessResponse = {
      type: 'success',
      status: 201,
      data: { id: 1 },
    };
    const editorText = ref('');
    const setOutput = vi.fn();

    vi.mocked(scriptService.getScriptById).mockResolvedValue(mockSuccessResponse);
    const { script } = useScriptCrud({
      editorText,
      setOutput,
    });

    script.value.id = -1;
    script.value.name = 'Oggie Boogie';
    editorText.value = 'I really hate tests';

    await flushPromises();
    expect(script.value).toStrictEqual(mockSuccessResponse.data);
  });

  it('updates a script', async () => {
    const mockSuccessResponse: SuccessResponse = {
      type: 'success',
      status: 200,
      data: { id: 1 },
    };
    const editorText = ref('');
    const setOutput = vi.fn();
    const { script, save, successMessage } = useScriptCrud({
      editorText,
      setOutput,
    });

    script.value.id = 1;
    script.value.name = 'Oggie Boogie';
    editorText.value = 'I really hate tests';

    vi.mocked(scriptService.updateScript).mockResolvedValue(mockSuccessResponse);
    save();
    await flushPromises();
    expect(successMessage.value).toBe('Saved!');
  });

  it('sets an error when fails to update script', async () => {
    const mockErrorResponse: ErrorResponse = {
      type: 'error',
      status: 500,
      error: 'error',
    };
    const editorText = ref('');
    const setOutput = vi.fn();
    const { script, save, errorMessage } = useScriptCrud({
      editorText,
      setOutput,
    });

    script.value.id = 1;
    script.value.name = 'Oggie Boogie';
    editorText.value = 'I really hate tests';

    vi.mocked(scriptService.updateScript).mockResolvedValue(mockErrorResponse);
    save();
    await flushPromises();
    expect(errorMessage.value).toBe(mockErrorResponse.error);
  });

  it('clears messages', async () => {
    const editorText = ref('');
    const setOutput = vi.fn();
    const { successMessage, errorMessage, clearMessages } = useScriptCrud({
      editorText,
      setOutput,
    });

    successMessage.value = 'success';
    errorMessage.value = 'uh oh';
    expect(successMessage.value).toBe('success');
    expect(errorMessage.value).toBe('uh oh');
    clearMessages();
    expect(successMessage.value).toBe('');
    expect(errorMessage.value).toBe('');
  });

  it('loads a script successfully', async () => {
    route.params.id = 1;
    const mockErrorResponse: ErrorResponse = {
      type: 'error',
      status: 500,
      error: 'error',
    };
    const editorText = ref('');
    const setOutput = vi.fn();

    vi.mocked(scriptService.getScriptById).mockResolvedValue(mockErrorResponse);
    const { script, errorMessage } = useScriptCrud({
      editorText,
      setOutput,
    });

    script.value.id = -1;
    script.value.name = '';
    editorText.value = '';

    await flushPromises();
    expect(errorMessage.value).toStrictEqual(mockErrorResponse.error);
  });
});
