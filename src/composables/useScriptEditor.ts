import type { Delta } from '@vueup/vue-quill';
import sanitize from 'sanitize-html';
import { computed, onMounted, onUnmounted, ref } from 'vue';

type Token = {
  value: string;
  position: number;
};

const actions = ['noop', 'mov', 'rotr', 'rotl', 'att', 'eat'];
const controls = ['ifEnemy', 'ifAlly', 'ifFood', 'ifEmpty', 'ifWall', 'goto'];

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

    overlay.value.scrollTo(
      (e.target as HTMLElement).scrollLeft,
      (e.target as HTMLElement).scrollTop,
    );
    lineNumberDiv.value.scrollTo(0, (e.target as HTMLElement).scrollTop);
  }

  function highlightErrorsInLine(line: string) {
    const tokens = extractTokens(line);

    if (tokens.length === 0) return line;

    if (actions.includes(tokens[0].value) && tokens.length > 1) {
      line = insertError(
        line,
        { value: line, position: 0 },
        tokens,
        `Expected end of line after action. Found &quot;${line.slice(tokens[1].position)}&quot;.`,
      );
    } else if (controls.includes(tokens[0].value)) {
      if (tokens.length === 1) {
        line = insertError(
          line,
          tokens[0],
          tokens,
          `Expected a label name after control. Found end of line.`,
        );
      } else if (tokens.length === 2) {
        if (!validLabelName(tokens[1].value)) {
          line = insertError(
            line,
            tokens[1],
            tokens,
            'A label name must only contain uppercase letters, numbers, and underscores.',
          );
        }
      } else {
        line = insertError(
          line,
          { value: line, position: 0 },
          tokens,
          `Expected end of line after control and label. Found &quot;${line.slice(
            tokens[2].position,
          )}&quot;.`,
        );
      }
    } else if (tokens[0].value.includes(':') && tokens.length > 1) {
      line = insertError(
        line,
        { value: line, position: 0 },
        tokens,
        `Expected end of line after label. Found &quot;${line.slice(tokens[1].position)}&quot;.`,
      );
    } else {
      for (const token of tokens) {
        if (token.value.startsWith(':')) {
          if (token.position !== 0) {
            line = insertError(
              line,
              token,
              tokens,
              'A label definition must occur at the beginning of a line.',
            );
          } else if (!validLabelName(token.value)) {
            line = insertError(
              line,
              token,
              tokens,
              'A label name must only contain uppercase letters, numbers, and underscores.',
            );
          }
        } else if (!actions.includes(token.value) && !controls.includes(token.value)) {
          line = insertError(
            line,
            token,
            tokens,
            `This is not a valid action or control.\nValid actions are: ${actions.join(
              ', ',
            )}.\nValid controls are: ${controls.join(', ')}.`,
          );
        }
      }
    }

    return line;
  }

  function insertError(line: string, token: Token, tokens: Token[], message: string) {
    const strToInsert =
      `<span class="script-editor-underline-error" title="${message}">` + token.value + '</span>';

    for (let i = tokens.indexOf(token) + 1; i < tokens.length || i === -1; i++) {
      tokens[i].position += strToInsert.length - token.value.length;
    }

    return (
      line.slice(0, token.position) + strToInsert + line.slice(token.position + token.value.length)
    );
  }

  function validLabelName(label: string) {
    return label.slice(1).match(/^[A-Z0-9_]+$/) != null;
  }

  function extractTokens(line: string) {
    line = removeComment(line);
    const tokens = line.match(/\S+/g);
    // create an array with objects like {token: "mov", index: 0}
    if (tokens == null) return [];
    let prevPosition = -1;
    return tokens.map((value) => {
      const position = line.indexOf(value, prevPosition + 1);
      prevPosition = position;
      return { value, position };
    });
  }

  function removeComment(line: string) {
    const commentIndex = line.indexOf('//');
    if (commentIndex === -1) return line;
    return line.slice(0, commentIndex);
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
      overlayContent.value = content
        .split('\n')
        .map((line) => highlightErrorsInLine(line))
        .join('\n');
    }, 750);
  }

  function displayTooltip(e: MouseEvent) {
    const tooltip = document.querySelector('.error-title');

    //check if mouse intersects with warning or error
    const doesIntersect = [...document.querySelectorAll('.script-editor-underline-error')].some(
      (el) => {
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
      },
    );

    if (!doesIntersect) {
      errorMessage.value = '';
    }
  }

  return {
    editorText,
    overlayContent,
    errorMessage,
    errorPosition,
    lineNumbers,
    updateText,
  };
}
