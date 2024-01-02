import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ScriptEditor from './ScriptEditor.vue';

// const mock = vi.hoisted(() => {
//   return {
//     useCompiler: vi.fn().mockReturnValue({
//       output: vi.fn(),
//       compileScript: vi.fn(),
//     }),
//   };
// });

// vi.mock('@/composables/useCompiler', () => ({
//   useCompiler: mock.useCompiler,
// }));

describe('ScriptEditor', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should mount and have spellcheck disabled', () => {
    const wrapper = mount(ScriptEditor, {
      attachTo: document.body,
    });

    expect(wrapper.find('.ql-editor').attributes('spellcheck')).toBe('false');

    wrapper.unmount();
  });

  it('should synchronize scroll', async () => {
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
});
