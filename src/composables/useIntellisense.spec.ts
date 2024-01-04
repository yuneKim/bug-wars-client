import { Delta, Quill } from '@vueup/vue-quill';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useIntellisense } from './useIntellisense';

describe('useIntellisense', () => {
  it('should generate a tooltip', () => {
    const { intellisense, intellisenseTooltip } = useIntellisense({
      quill: ref(new Quill(document.createElement('div'))),
      editorDiv: ref(document.createElement('div')),
      caretIndex: ref(0),
    });

    const delta = new Delta();
    delta.ops = [{ retain: 1 }, { insert: 't' }];

    const oldContents = new Delta();
    oldContents.ops = [{ insert: 'a\n' }];

    intellisense({ delta, oldContents });

    expect(intellisenseTooltip.value.display).toBe(true);
    expect(intellisenseTooltip.value.preventDisplay).toBe(false);
    expect(intellisenseTooltip.value.items).toEqual([{ type: 'action', value: 'att' }]);
    expect(intellisenseTooltip.value.selectedItem).toBe(0);
  });

  it('should interrupt keyboard events', () => {
    const { intellisenseInterrupt, intellisenseTooltip } = useIntellisense({
      quill: ref(new Quill(document.createElement('div'))),
      editorDiv: ref(document.createElement('div')),
      caretIndex: ref(0),
    });

    intellisenseTooltip.value.display = true;
    intellisenseTooltip.value.items = [
      { type: 'control', value: 'ifEnemy' },
      { type: 'control', value: 'ifFood' },
    ];

    let keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    intellisenseInterrupt(keyboardEvent);
    expect(intellisenseTooltip.value.selectedItem).toBe(1);

    keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    intellisenseInterrupt(keyboardEvent);
    expect(intellisenseTooltip.value.selectedItem).toBe(0);

    keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    intellisenseInterrupt(keyboardEvent);
    expect(intellisenseTooltip.value.selectedItem).toBe(0);

    keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    intellisenseInterrupt(keyboardEvent);
    expect(intellisenseTooltip.value.display).toBe(false);

    intellisenseTooltip.value.display = true;
    keyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    intellisenseInterrupt(keyboardEvent);
    expect(intellisenseTooltip.value.display).toBe(false);
    expect(intellisenseTooltip.value.preventDisplay).toBe(true);
  });
});
