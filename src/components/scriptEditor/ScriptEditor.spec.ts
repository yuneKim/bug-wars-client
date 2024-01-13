import { useCompiler } from '@/composables/useCompiler';
import { mount, shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { computed } from 'vue';
import ScriptEditor from './ScriptEditor.vue';

vi.mock('@/composables/useCompiler');
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ params: { id: '1' } })),
}));

describe('ScriptEditor', () => {
  it('should mount and have spellcheck disabled', () => {
    vi.mocked(useCompiler).mockImplementation(() => ({
      output: computed(() => 'some output'),
      setOutput: vi.fn(),
      compileScript: vi.fn(),
    }));

    const wrapper = mount(ScriptEditor, {
      attachTo: document.body,
    });

    expect(wrapper.find('.ql-editor').attributes('spellcheck')).toBe('false');

    wrapper.unmount();
  });

  it('should synchronize scroll', async () => {
    vi.mocked(useCompiler).mockImplementation(() => ({
      output: computed(() => 'some output'),
      setOutput: vi.fn(),
      compileScript: vi.fn(),
    }));

    const wrapper = mount(ScriptEditor, {
      attachTo: document.body,
    });

    const spy = vi.fn();

    Element.prototype.scrollTo = spy;

    const editor = wrapper.find('.ql-editor');
    editor.element.scrollTop = 100;

    await editor.trigger('scroll');

    expect(spy).toHaveBeenCalledWith(0, 100);

    wrapper.unmount();
  });

  it('should compile on click', async () => {
    const spy = vi.fn();

    vi.mocked(useCompiler).mockImplementation(() => ({
      output: computed(() => 'some output'),
      setOutput: vi.fn(),
      compileScript: spy,
    }));

    const wrapper = shallowMount(ScriptEditor);

    await wrapper.find('.compile-button').trigger('click');

    expect(spy).toHaveBeenCalled();
  });
});
