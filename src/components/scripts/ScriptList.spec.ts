import { flushPromises, shallowMount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ScriptList from './ScriptList.vue';
import { scriptService } from '@/services/scriptService';

vi.mock('@/services/scriptService');

describe('ScriptList.vue', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders a list of scripts', async () => {
    const scripts = [
      {
        id: 1,
        name: 'string',
        raw: 'string',
        bytecode: 'string',
        isBytecodeValid: false,
      },
      {
        id: 2,
        name: 'string',
        raw: 'string',
        bytecode: 'string',
        isBytecodeValid: false,
      },
    ];

    vi.mocked(scriptService.getAllScripts).mockResolvedValue({
      type: 'success',
      status: 200,
      data: scripts,
    });

    const wrapper = shallowMount(ScriptList);

    await flushPromises();
    expect(wrapper.findAll('[data-test="script"]').length).toBe(2);
  });

  it('shows Dialog when delete button is clicked', async () => {
    const scripts = [
      {
        id: 1,
        name: 'string',
        raw: 'string',
        bytecode: 'string',
        isBytecodeValid: false,
      },
    ];

    vi.mocked(scriptService.getAllScripts).mockResolvedValue({
      type: 'success',
      status: 200,
      data: scripts,
    });

    const wrapper = shallowMount(ScriptList);

    await flushPromises();
    await wrapper.find('[data-test="delete-button"]').trigger('click');
    expect(wrapper.find('[data-test="dialog"]').attributes('visible')).toBe('true');
  });
});
