<script setup lang="ts">
import { useScriptEditor } from '@/composables/useScriptEditor';
import { scriptService } from '@/services/scriptService';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { offset, position } from 'caret-pos';
import { ref } from 'vue';

const { editorText, overlayContent, errorMessage, errorPosition, lineNumbers, updateText } =
  useScriptEditor();

const byteCode = ref<number[]>([]);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Control') {
    // console.log(window.getSelection());
    const editor = document.querySelector('.ql-editor');

    const pos = position(editor as HTMLElement);
    const off = offset(editor as HTMLElement);
    // console.log(pos, off);
    // console.log(intellisensePos.value);
    intellisensePos.value = { x: off.left + 'px', y: off.top + 'px' };
  }
});

const intellisensePos = ref({ x: '0px', y: '0px' });

async function compileScript() {
  const response = await scriptService.parse({ code: editorText.value });
  byteCode.value = response.data;
}
</script>

<template>
  <div class="script-editor-container">
    <aside class="script-selection">
      <ul>
        <li>Script 1</li>
        <li>Script 2</li>
        <li>Script 3</li>
        <li>Script 4</li>
      </ul>
    </aside>
    <main class="script-editing-window">
      <h1>Script Editor</h1>
      <div class="editor-wrapper">
        <div class="line-numbers">
          <div class="line-number" v-for="n of lineNumbers" :key="n">{{ n }}</div>
        </div>
        <QuillEditor theme="snow" @update:content="updateText" />
        <div class="editor-overlay" v-html="overlayContent"></div>
      </div>
      <button type="button" @click="compileScript">Compile</button>
      <button type="button">Save</button>
      <div>{{ JSON.stringify(editorText) }}</div>
      <div>{{ JSON.stringify(overlayContent) }}</div>
      <div>{{ byteCode }}</div>
    </main>
    <!-- <Teleport to="body">
      <div class="intellisense"></div>
    </Teleport> -->
    <Teleport to="body">
      <div v-show="errorMessage" class="error-title">{{ errorMessage }}</div>
    </Teleport>
  </div>
</template>

<style scoped>
.script-editor-container {
  --editor-font-size: 1rem;
  --editor-line-height: 1.25rem;
  --editor-font-family: 'Courier New', Courier, monospace;

  margin-top: 10px;
  width: 100%;
  height: 90vh;
  display: grid;
  grid-template-columns: 200px 1fr;
}

.script-selection {
  border-right: 1px solid #ccc;
}

.script-editing-window {
  padding: 10px;
}

.editor-wrapper {
  position: relative;
  max-width: 500px;
  height: 500px;
  border: 1px solid #ccc;
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
  text-underline-offset: 4px;
  color: transparent;
}

:deep(.script-editor-underline-error) {
  text-decoration-color: red;
}

:deep(.script-editor-underline-warning) {
  text-decoration-color: orange;
}

.intellisense {
  width: 50px;
  height: 50px;
  background-color: red;
  position: absolute;
  top: v-bind('intellisensePos.y');
  left: v-bind('intellisensePos.x');
}

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
</style>
