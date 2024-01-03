import { ACTIONS, CONTROLS } from '@/config/constants';
import { editorOptions } from '@/config/quill';
import { getLabels } from '@/utils/scriptEditor/getLabels';
import { highlightScriptErrors } from '@/utils/scriptEditor/highlightScriptErrors';
import { Delta, Quill } from '@vueup/vue-quill';
import { offset } from 'caret-pos';
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

  const editorText = ref('');
  const overlayContent = ref('');
  const errorTooltip = ref<ErrorTooltip>({ message: '', position: { x: '0px', y: '0px' } });
  const intellisenseTooltip = ref<IntellisenseTooltip>({
    display: false,
    items: [],
    selectedItem: 0,
    position: { x: '0px', y: '0px' },
  });
  const typingTimer = ref<number>(0);

  const lineNumbers = computed(() => {
    return editorText.value.match(/\n/g)?.length ?? 1;
  });

  onMounted(() => {
    document.addEventListener('mousemove', displayTooltip);
  });

  onUnmounted(() => {
    document.removeEventListener('mousemove', displayTooltip);
  });

  function initializeQuill(
    quillInstance: Quill,
    lineNumberRef: HTMLElement | null,
    overlayDiv: HTMLElement | null,
    errorTooltipDivNode: HTMLElement | null,
  ) {
    quill.value = quillInstance;
    lineNumberDiv.value = lineNumberRef;
    overlay.value = overlayDiv;
    errorTooltipDiv.value = errorTooltipDivNode;

    editor.value = quillInstance.root;
    editor.value?.setAttribute('spellcheck', 'false');
    editor.value?.addEventListener('scroll', synchronizeScroll);
    // editor.value?.addEventListener('keydown', intellisenseInterrupt, true);
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
      return;
    }

    const options = getIntellisenseOptions(contents, typedWord);

    const off = offset(editor.value as HTMLElement);

    intellisenseTooltip.value = {
      display: options.length > 0,
      items: options,
      selectedItem: 0,
      position: { x: off.left + 'px', y: off.top + 'px' },
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
    console.log(intellisenseTooltip.value.display);
    if (!intellisenseTooltip.value.display) return;
    console.log('this happened');

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const caretIndex = quill.value.getSelection()?.index ?? 0;
      const content = quill.value.getText(0);
      const lastWord = getLastWord(content.slice(0, caretIndex));
      console.log(content, caretIndex, lastWord);
      const option = intellisenseTooltip.value.items[intellisenseTooltip.value.selectedItem];
      console.log(option);
      quill.value.insertText(caretIndex, option?.value.substring(lastWord.length) ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (intellisenseTooltip.value.selectedItem < intellisenseTooltip.value.items.length - 1)
        intellisenseTooltip.value.selectedItem++;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (intellisenseTooltip.value.selectedItem > 0) intellisenseTooltip.value.selectedItem--;
    }
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
  };
}
