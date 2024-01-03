import { ACTIONS, CONTROLS, SCRIPT_EDITOR_OFFSET } from '@/config/constants';
import { editorOptions } from '@/config/quill';
import { getLabels } from '@/utils/scriptEditor/getLabels';
import { highlightScriptErrors } from '@/utils/scriptEditor/highlightScriptErrors';
import { Delta, Quill } from '@vueup/vue-quill';
import sanitize from 'sanitize-html';
import { computed, onMounted, onUnmounted, ref } from 'vue';

type ErrorTooltip = {
  message: string;
  position: { x: string; y: string };
};

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

export function useScriptEditor() {
  const quill = ref<Quill | null>(null);
  const editor = ref<HTMLElement | null>(null);
  const overlay = ref<HTMLElement | null>(null);
  const lineNumberDiv = ref<HTMLElement | null>(null);
  const errorTooltipDiv = ref<HTMLElement | null>(null);
  const intellisenseTooltipDiv = ref<HTMLElement | null>(null);

  const editorText = ref('');
  const overlayContent = ref('');
  const errorTooltip = ref<ErrorTooltip>({ message: '', position: { x: '0px', y: '0px' } });
  const intellisenseTooltip = ref<IntellisenseTooltip>({
    display: false,
    preventDisplay: false,
    items: [],
    selectedItem: 0,
    position: { x: '0px', y: '0px' },
  });
  const caretIndex = ref(0);
  const typingTimer = ref<number>(0);

  const lineNumbers = computed(() => {
    return editorText.value.match(/\n/g)?.length ?? 1;
  });

  onMounted(() => {
    document.addEventListener('mousemove', displayTooltip);
    document.addEventListener('click', clickOutsideIntellisense);
  });

  onUnmounted(() => {
    document.removeEventListener('mousemove', displayTooltip);
    document.addEventListener('click', clickOutsideIntellisense);
  });

  function clickOutsideIntellisense() {
    intellisenseTooltip.value.preventDisplay = false;
    intellisenseTooltip.value.display = false;
  }

  function initializeQuill(
    quillInstance: Quill,
    lineNumberRef: HTMLElement | null,
    overlayDiv: HTMLElement | null,
    errorTooltipDivNode: HTMLElement | null,
    intellisenseTooltipDivNode: HTMLElement | null,
  ) {
    quill.value = quillInstance;
    lineNumberDiv.value = lineNumberRef;
    overlay.value = overlayDiv;
    errorTooltipDiv.value = errorTooltipDivNode;
    intellisenseTooltipDiv.value = intellisenseTooltipDivNode;

    editor.value = quillInstance.root;
    editor.value?.setAttribute('spellcheck', 'false');
    editor.value?.addEventListener('scroll', synchronizeScroll);
    editor.value?.addEventListener('keydown', intellisenseInterrupt, true);
  }

  function synchronizeScroll(e: Event) {
    if (overlay.value == null || lineNumberDiv.value == null) return;

    overlay.value.scrollTo(
      (e.target as HTMLElement).scrollLeft,
      (e.target as HTMLElement).scrollTop,
    );
    lineNumberDiv.value.scrollTo(0, (e.target as HTMLElement).scrollTop);
  }

  function updateText(delta: Delta) {
    caretIndex.value = quill.value.getSelection()?.index ?? 0;
    if (delta.ops.length === 0 || typeof delta.ops[0].insert !== 'string') return;
    const content = sanitize(delta.ops[0].insert, {
      allowedTags: [],
      allowedAttributes: {},
    });
    editorText.value = content;
    overlayContent.value = content;

    clearTimeout(typingTimer.value);
    typingTimer.value = window.setTimeout(() => {
      overlayContent.value = highlightScriptErrors(content);
    }, 750);
  }

  function displayTooltip(e: MouseEvent) {
    //check if mouse intersects with warning or error
    if (overlay.value == null || errorTooltipDiv.value == null) return;
    const doesIntersect = [
      ...overlay.value.querySelectorAll(
        '.script-editor-underline-error, .script-editor-underline-warning',
      ),
    ].some((el) => {
      const rect = el.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        errorTooltip.value = {
          message: (el as HTMLElement).title,
          position: { x: rect.left + 'px', y: rect.top + 'px' },
        };
        return true;
      } else if (e.target === errorTooltipDiv.value) {
        return true;
      }
      return false;
    });

    if (!doesIntersect) {
      errorTooltip.value.message = '';
    }
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

    const options = getIntellisenseOptions(contents, typedWord);

    const coords = getIntellisenseCoords();

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

  function getIntellisenseCoords() {
    const relativeCoords = quill.value.getBounds(quill.value.getSelection()?.index ?? 0);

    const editorRect = editor.value?.getBoundingClientRect();
    const editorTop = editorRect?.top ?? 0;
    const editorLeft = editorRect?.left ?? 0;

    return {
      left: relativeCoords.left + editorLeft - SCRIPT_EDITOR_OFFSET,
      top: relativeCoords.top + editorTop,
    };
  }

  function getTypedWord(delta: Delta, existing: string): string | undefined {
    const cursor = delta.ops.find((op) => op.retain != null)?.retain ?? 0;
    const newChar = delta.ops.find((op) => op.insert != null)?.insert ?? '';
    if (newChar === ' ' || newChar === '\n') return;

    const existingWord = getLastWord(existing.slice(0, cursor));

    return existingWord + newChar;
  }

  function getIntellisenseOptions(contents: string, typedWord: string) {
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
    quill.value.insertText(caretIndex.value, option?.value.substring(lastWord.length) ?? '');
    quill.value.setSelection(caretIndex.value + (option?.value.length ?? 0));
  }

  function getLastWord(contents: string) {
    const words = contents.split(/[\s,]+/);
    return words[words.length - 1];
  }

  return {
    editorOptions,
    editorText,
    overlayContent,
    errorTooltip,
    lineNumbers,
    updateText,
    initializeQuill,
    intellisense,
    intellisenseTooltip,
    intellisenseClickHandler,
  };
}
