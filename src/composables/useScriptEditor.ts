import { editorOptions } from '@/config/quill';
import { highlightScriptErrors } from '@/utils/highlightScriptErrors';
import { Quill, type Delta } from '@vueup/vue-quill';
import sanitize from 'sanitize-html';
import { computed, onMounted, onUnmounted, ref } from 'vue';

type ErrorTooltip = {
  message: string;
  position: { x: string; y: string };
};

export function useScriptEditor() {
  const editor = ref<HTMLElement | null>(null);
  const overlay = ref<HTMLElement | null>(null);
  const lineNumberDiv = ref<HTMLElement | null>(null);
  const errorTooltipDiv = ref<HTMLElement | null>(null);

  const editorText = ref('');
  const overlayContent = ref('');
  const errorTooltip = ref<ErrorTooltip>({ message: '', position: { x: '0px', y: '0px' } });
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
    quill: Quill,
    lineNumberRef: HTMLElement | null,
    overlayDiv: HTMLElement | null,
    errorTooltipDivNode: HTMLElement | null,
  ) {
    lineNumberDiv.value = lineNumberRef;
    overlay.value = overlayDiv;
    errorTooltipDiv.value = errorTooltipDivNode;

    editor.value = quill.root;
    editor.value?.setAttribute('spellcheck', 'false');
    editor.value?.addEventListener('scroll', synchronizeScroll);
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

  return {
    editorOptions,
    editorText,
    overlayContent,
    errorTooltip,
    lineNumbers,
    updateText,
    initializeQuill,
  };
}
