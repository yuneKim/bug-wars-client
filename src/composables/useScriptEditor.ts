import { editorOptions } from '@/config/quill';
import { highlightScriptErrors } from '@/utils/highlightScriptErrors';
import { type Delta } from '@vueup/vue-quill';
import sanitize from 'sanitize-html';
import { computed, onMounted, onUnmounted, ref } from 'vue';

export function useScriptEditor() {
  const editor = ref<HTMLElement | null>(null);
  const overlay = ref<HTMLElement | null>(null);
  const lineNumberDiv = ref<HTMLElement | null>(null);

  const editorText = ref('');
  const overlayContent = ref('');
  const errorMessage = ref('');
  const errorPosition = ref({ x: '0px', y: '0px' });
  const typingTimer = ref<number>(0);

  const lineNumbers = computed(() => {
    return editorText.value.match(/\n/g)?.length ?? 1;
  });

  onMounted(() => {
    editor.value = document.querySelector('.ql-editor');
    overlay.value = document.querySelector('.editor-overlay');
    lineNumberDiv.value = document.querySelector('.line-numbers');

    editor.value?.setAttribute('spellcheck', 'false');
    editor.value?.addEventListener('scroll', synchronizeScroll);
    document.addEventListener('mousemove', displayTooltip);
  });

  onUnmounted(() => {
    editor.value?.removeEventListener('scroll', synchronizeScroll);
    document.removeEventListener('mousemove', displayTooltip);
  });

  function synchronizeScroll(e: Event) {
    if (overlay.value == null || lineNumberDiv.value == null) return;
    console.log(lineNumberDiv.value.outerHTML);

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
    const tooltip = document.querySelector('.error-title');

    //check if mouse intersects with warning or error
    const doesIntersect = [
      ...document.querySelectorAll(
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
        errorMessage.value = (el as HTMLElement).title;
        errorPosition.value = {
          x: rect.left + 'px',
          y: rect.top + 'px',
        };
        return true;
      } else if (tooltip != null && e.target === tooltip) {
        return true;
      }
      return false;
    });

    if (!doesIntersect) {
      errorMessage.value = '';
    }
  }

  return {
    editorOptions,
    editorText,
    overlayContent,
    errorMessage,
    errorPosition,
    lineNumbers,
    updateText,
  };
}
