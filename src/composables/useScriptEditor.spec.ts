import { Delta, Quill } from '@vueup/vue-quill';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useScriptEditor } from './useScriptEditor';

describe('useScriptEditor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('should update overlay text', () => {
    const { updateText, overlayContent, initializeQuill } = useScriptEditor({
      overlayDiv: ref(document.createElement('div')),
      lineNumberDiv: ref(document.createElement('div')),
      errorTooltipDiv: ref(document.createElement('div')),
    });

    const quill = new Quill(document.createElement('div'));
    initializeQuill(quill);

    const input = 'some_text';
    const output =
      '<span class="script-editor-underline-error" title="This is not a valid action or control.\nValid actions are: noop, mov, rotr, rotl, att, eat.\nValid controls are: ifEnemy, ifAlly, ifFood, ifEmpty, ifWall, goto.">some_text</span>';
    const delta = new Delta([{ insert: input }]);

    updateText(delta);
    vi.runAllTimers();

    const delta2 = new Delta([]);
    updateText(delta2);

    expect(overlayContent.value).toBe(output);
  });

  it('should update editor text', () => {
    const { setText, editorText, initializeQuill } = useScriptEditor({
      overlayDiv: ref(document.createElement('div')),
      lineNumberDiv: ref(document.createElement('div')),
      errorTooltipDiv: ref(document.createElement('div')),
    });

    const quill = new Quill(document.createElement('div'));
    initializeQuill(quill);

    const input = 'some_text';
    setText(input);
    vi.runAllTimers();

    expect(editorText.value).toBe(input);
  });
});
