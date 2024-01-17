import { editorOptions } from '@/config/quill';
import { highlightScriptErrors } from '@/utils/scriptEditor/highlightScriptErrors';
import { Quill } from '@vueup/vue-quill';
import sanitize from 'sanitize-html';
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { useIntellisense } from './useIntellisense';

type ErrorTooltip = {
  message: string;
  position: { x: string; y: string };
};

type Params = {
  overlayDiv: Ref<HTMLElement | null>;
  lineNumberDiv: Ref<HTMLElement | null>;
  errorTooltipDiv: Ref<HTMLElement | null>;
};

export function useScriptEditor({ overlayDiv, lineNumberDiv, errorTooltipDiv }: Params) {
  const quill = ref<Quill | null>(null);
  const editorDiv = ref<HTMLElement | null>(null);
  const editorText = ref('');
  const overlayContent = ref('');
  const errorTooltip = ref<ErrorTooltip>({ message: '', position: { x: '0px', y: '0px' } });
  const caretIndex = ref(0);
  const typingTimer = ref<number>(0);

  const { intellisense, intellisenseTooltip, intellisenseClickHandler, intellisenseInterrupt } =
    useIntellisense({
      quill,
      editorDiv,
      caretIndex,
    });

  const lineNumbers = computed(() => {
    return editorText.value.match(/\n/g)?.length ?? 1;
  });

  onMounted(() => {
    document.addEventListener('mousemove', displayErrorTooltip);
  });

  onUnmounted(() => {
    document.removeEventListener('mousemove', displayErrorTooltip);
  });

  watch(editorText, (newVal) => {
    updateText(newVal);
  });

  function initializeQuill(quillInstance: Quill) {
    quill.value = quillInstance;

    editorDiv.value = quillInstance.root;
    quillInstance.root.setAttribute('spellcheck', 'false');
    quillInstance.root.addEventListener('scroll', synchronizeScroll);
    quillInstance.root.addEventListener('keydown', intellisenseInterrupt, true);
  }

  function synchronizeScroll(e: Event) {
    if (overlayDiv.value == null || lineNumberDiv.value == null) return;

    overlayDiv.value.scrollTo(
      (e.target as HTMLElement).scrollLeft,
      (e.target as HTMLElement).scrollTop,
    );
    lineNumberDiv.value.scrollTo(0, (e.target as HTMLElement).scrollTop);
  }

  function updateText(content: string) {
    caretIndex.value = quill.value.getSelection()?.index ?? 0;
    content = sanitize(content, {
      allowedTags: [],
      allowedAttributes: {},
    });
    overlayContent.value = content;

    clearTimeout(typingTimer.value);
    typingTimer.value = window.setTimeout(() => {
      overlayContent.value = highlightScriptErrors(content);
    }, 750);
  }

  function displayErrorTooltip(e: MouseEvent) {
    //check if mouse intersects with warning or error
    if (overlayDiv.value == null || errorTooltipDiv.value == null) return;
    const doesIntersect = [
      ...overlayDiv.value.querySelectorAll(
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

  return {
    editorOptions,
    editorText,
    overlayContent,
    errorTooltip,
    lineNumbers,
    initializeQuill,
    intellisense,
    intellisenseTooltip,
    intellisenseClickHandler,
  };
}
