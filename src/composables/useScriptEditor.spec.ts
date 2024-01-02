import { Delta } from '@vueup/vue-quill';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
    const { updateText, overlayContent } = useScriptEditor();

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
});
