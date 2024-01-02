<script setup lang="ts">
import { useCompiler } from '@/composables/useCompiler';
import { useScriptEditor } from '@/composables/useScriptEditor';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const {
  editorOptions,
  editorText,
  overlayContent,
  errorMessage,
  errorPosition,
  lineNumbers,
  updateText,
} = useScriptEditor();
const { output, compileScript } = useCompiler();

// window.addEventListener('keydown', (e) => {
//   if (e.key === 'Control') {
//     // console.log(window.getSelection());
//     const editor = document.querySelector('.ql-editor');

//     const pos = position(editor as HTMLElement);
//     const off = offset(editor as HTMLElement);
//     // console.log(pos, off);
//     // console.log(intellisensePos.value);
//     intellisensePos.value = { x: off.left + 'px', y: off.top + 'px' };
//   }
// });

// const intellisensePos = ref({ x: '0px', y: '0px' });
</script>

<template>
  <main class="script-editing-window">
    <h1>Script Editor</h1>
    <div class="editor-wrapper">
      <div class="line-numbers">
        <div class="line-number" v-for="n of lineNumbers" :key="n">{{ n }}</div>
      </div>
      <QuillEditor :options="editorOptions" @update:content="updateText" />
      <div class="editor-overlay" v-html="overlayContent"></div>
    </div>
    <div class="button-wrapper">
      <button type="button" @click="compileScript(editorText)">Compile</button>
    </div>
    <h3>Output:</h3>
    <div class="output-text">{{ output }}</div>
    <div>{{ JSON.stringify(editorText) }}</div>
    <div>{{ JSON.stringify(overlayContent) }}</div>
  </main>
  <!-- <Teleport to="body">
      <div class="intellisense"></div>
    </Teleport> -->
  <Teleport to="body">
    <div v-show="errorMessage" class="error-title">{{ errorMessage }}</div>
  </Teleport>
</template>

<style scoped>
.script-editing-window {
  --editor-font-size: 1rem;
  --editor-line-height: 1.5rem;
  --editor-font-family: 'Courier New', Courier, monospace;

  padding: 10px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.editor-wrapper {
  position: relative;
  height: 500px;
  border: 1px solid #ccc;
  border-top-width: 2px;
}

:deep(.ql-editor),
.editor-overlay {
  position: absolute;
  inset: 0;
  font-family: var(--editor-font-family);
  font-size: var(--editor-font-size);
  line-height: var(--editor-line-height);
  white-space: pre;
}

:deep(.ql-editor) {
  padding-left: 0;
  left: 35px;
}

.editor-overlay {
  z-index: -1;
  padding: 12px 15px 12px 0;
  left: 36px;
  tab-size: 4;
  overflow-y: auto;
}

.line-numbers {
  position: absolute;
  border-right: 1px solid #ccc;
  padding-right: 5px;
  padding-bottom: 12px;
  height: 100%;
  padding-top: 12px;
  box-sizing: border-box;
  overflow-y: hidden;
}

.line-number {
  text-align: right;
  width: 1.5rem;
  color: #ccc;
  font-family: var(--editor-font-family);
  font-size: var(--editor-font-size);
  line-height: var(--editor-line-height);
}

:deep(.ql-toolbar) {
  display: none;
}

:deep(.script-editor-underline-error),
:deep(.script-editor-underline-warning) {
  text-decoration: wavy underline;
  text-underline-offset: 5px;
  color: transparent;
}

:deep(.script-editor-underline-error) {
  text-decoration-color: red;
}

:deep(.script-editor-underline-warning) {
  text-decoration-color: orange;
}

/* .intellisense {
  width: 50px;
  height: 50px;
  background-color: red;
  position: absolute;
  top: v-bind('intellisensePos.y');
  left: v-bind('intellisensePos.x');
} */

.error-title {
  position: absolute;
  top: v-bind('errorPosition.y');
  left: v-bind('errorPosition.x');
  border: 1px solid black;
  background: rgb(233, 233, 233);
  padding: 5px;
  transform: translate(0, -100%);
  max-width: 300px;
}

.output-text {
  font-family: var(--editor-font-family);
  font-size: var(--editor-font-size);
  line-height: var(--editor-line-height);
  border: 2px solid #ccc;
  padding: 12px;
  white-space: pre-wrap;
}
</style>
