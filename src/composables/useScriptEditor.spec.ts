import { Quill } from '@vueup/vue-quill';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { useScriptEditor } from './useScriptEditor';

describe('useScriptEditor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it('should update overlay text', async () => {
    const { editorText, overlayContent, initializeQuill } = useScriptEditor({
      overlayDiv: ref(document.createElement('div')),
      lineNumberDiv: ref(document.createElement('div')),
      errorTooltipDiv: ref(document.createElement('div')),
    });

    const quill = new Quill(document.createElement('div'));
    initializeQuill(quill);

    const input = 'some_text';
    const output =
      '<span class="script-editor-underline-error" title="This is not a valid action or control.\nValid actions are: noop, mov, rotr, rotl, att, eat.\nValid controls are: ifEnemy, ifAlly, ifFood, ifEmpty, ifWall, goto.">some_text</span>';

    editorText.value = input;
    await nextTick();
    vi.runAllTimers();

    expect(overlayContent.value).toBe(output);
  });
});
