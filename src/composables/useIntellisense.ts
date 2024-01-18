import { ACTIONS, CONTROLS, SCRIPT_EDITOR_OFFSET } from '@/config/constants';
import { getLabels } from '@/utils/scriptEditor/getLabels';
import type { Delta, Quill } from '@vueup/vue-quill';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

type IntellisenseOption = {
  type: 'label' | 'action' | 'control';
  value: string;
};

type IntellisenseTooltip = {
  display: boolean;
  preventDisplay: boolean;
  items: IntellisenseOption[];
  selectedItem: number;
  position: { x: string; y: string };
};

type Params = {
  quill: Ref<Quill | null>;
  editorDiv: Ref<HTMLElement | null>;
  caretIndex: Ref<number>;
};

export function useIntellisense({ quill, editorDiv, caretIndex }: Params) {
  const intellisenseTooltip = ref<IntellisenseTooltip>({
    display: false,
    preventDisplay: false,
    items: [],
    selectedItem: 0,
    position: { x: '0px', y: '0px' },
  });

  onMounted(() => {
    document.addEventListener('click', clickHandler);
  });

  onUnmounted(() => {
    document.addEventListener('click', clickHandler);
  });

  function clickHandler() {
    intellisenseTooltip.value.preventDisplay = false;
    intellisenseTooltip.value.display = false;
  }

  function intellisense({ delta, oldContents }: { delta: Delta; oldContents: Delta }) {
    const contents = oldContents.ops.find((op) => op.insert != null)?.insert ?? '';
    if (typeof contents !== 'string') return;

    const typedWord = getTypedWord(delta, contents);

    // close intellisense
    if (!typedWord) {
      intellisenseTooltip.value.display = false;
      intellisenseTooltip.value.preventDisplay = false;
      return;
    }

    const options = getOptions(contents, typedWord);

    const coords = getCoords();

    const display =
      options.length > 0 &&
      (intellisenseTooltip.value.display || delta.ops.every((op) => op.delete == null));

    intellisenseTooltip.value = {
      display,
      preventDisplay: intellisenseTooltip.value.preventDisplay,
      items: options,
      selectedItem: 0,
      position: { x: coords.left + 'px', y: coords.top + 'px' },
    };
  }

  function getTypedWord(delta: Delta, existing: string): string | undefined {
    const cursor = delta.ops.find((op) => op.retain != null)?.retain ?? 0;
    const newChar = delta.ops.find((op) => op.insert != null)?.insert ?? '';
    if (newChar === ' ' || newChar === '\n') return;

    const existingWord = getLastWord(existing.slice(0, cursor));

    return existingWord + newChar;
  }

  function getLastWord(contents: string) {
    const words = contents.split(/[\s,]+/);
    return words[words.length - 1];
  }

  function getOptions(contents: string, typedWord: string) {
    const possibleWords = {
      label: getLabels(contents),
      action: ACTIONS,
      control: CONTROLS,
    };

    return Object.entries(possibleWords).reduce((result, [type, words]) => {
      const matchingWords = words.filter(
        (word) => word.startsWith(typedWord) && word !== typedWord,
      );
      return [
        ...result,
        ...matchingWords.map((word) => ({ type, value: word }) as IntellisenseOption),
      ];
    }, [] as IntellisenseOption[]);
  }

  function getCoords() {
    const relativeCoords = quill.value.getBounds(quill.value.getSelection()?.index ?? 0);

    const editorRect = editorDiv.value?.getBoundingClientRect();
    const editorTop = editorRect?.top ?? 0;
    const editorLeft = editorRect?.left ?? 0;

    return {
      left: relativeCoords.left + editorLeft - SCRIPT_EDITOR_OFFSET,
      top: relativeCoords.top + editorTop,
    };
  }

  function intellisenseInterrupt(e: KeyboardEvent) {
    if (!intellisenseTooltip.value.display) return;

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      autoComplete();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (intellisenseTooltip.value.selectedItem < intellisenseTooltip.value.items.length - 1)
        intellisenseTooltip.value.selectedItem++;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (intellisenseTooltip.value.selectedItem > 0) intellisenseTooltip.value.selectedItem--;
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      intellisenseTooltip.value.display = false;
    } else if (e.key === 'Escape') {
      intellisenseTooltip.value.display = false;
      intellisenseTooltip.value.preventDisplay = true;
    }
  }

  function intellisenseClickHandler() {
    autoComplete();
  }

  function autoComplete() {
    const content = quill.value.getText(0);
    const lastWord = getLastWord(content.slice(0, caretIndex.value));
    const option = intellisenseTooltip.value.items[intellisenseTooltip.value.selectedItem];
    const oldCaretIndex = caretIndex.value;
    quill.value.insertText(oldCaretIndex, option?.value.substring(lastWord.length) ?? '');

    const newCaretIndex = oldCaretIndex + (option?.value.length ?? 0) - lastWord.length;
    quill.value.setSelection(newCaretIndex);
  }

  return {
    intellisense,
    intellisenseTooltip,
    intellisenseClickHandler,
    intellisenseInterrupt,
  };
}
