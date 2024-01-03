<script setup lang="ts">
import { useCompiler } from '@/composables/useCompiler';
import { useScriptEditor } from '@/composables/useScriptEditor';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ref } from 'vue';

const {
  editorOptions,
  editorText,
  overlayContent,
  errorTooltip,
  lineNumbers,
  updateText,
  initializeQuill,
  intellisense,
  intellisenseTooltip,
} = useScriptEditor();
const { output, compileScript } = useCompiler();

const lineNumberDiv = ref<HTMLElement | null>(null);
const overlayDiv = ref<HTMLElement | null>(null);
const errorTooltipDiv = ref<HTMLElement | null>(null);

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
      <div ref="lineNumberDiv" class="line-numbers">
        <div class="line-number" v-for="n of lineNumbers" :key="n">{{ n }}</div>
      </div>
      <QuillEditor
        ref="testRef"
        :options="editorOptions"
        @textChange="intellisense"
        @update:content="updateText"
        @ready="(quill) => initializeQuill(quill, lineNumberDiv, overlayDiv, errorTooltipDiv)"
      />
      <div ref="overlayDiv" class="editor-overlay" v-html="overlayContent"></div>
    </div>
    <div class="button-wrapper">
      <button class="compile-button" type="button" @click="compileScript(editorText)">
        Compile
      </button>
    </div>
    <h3>Output:</h3>
    <div class="output-text">{{ output }}</div>
  </main>
  <Teleport to="body">
    <div v-if="intellisenseTooltip.display" class="intellisense">
      <ul class="intellisense-item-list">
        <li
          v-for="(item, index) in intellisenseTooltip.items"
          :key="item.value"
          :class="{ 'intellisense-selected': intellisenseTooltip.selectedItem === index }"
        >
          <span>{{ item.value }}</span>
          <span>{{ item.type }}</span>
        </li>
      </ul>
    </div>
  </Teleport>
  <Teleport to="body">
    <div ref="errorTooltipDiv" v-show="errorTooltip.message" class="error-title">
      {{ errorTooltip.message }}
    </div>
  </Teleport>
</template>

<style scoped>
.script-editing-window {
  padding: 10px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.editor-wrapper {
  position: relative;
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
  color: transparent;
}

.line-numbers {
  position: absolute;
  border-right: 1px solid #ccc;
  padding-top: 14px;
  padding-right: 5px;
  padding-bottom: 12px;
  height: 100%;
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
}

:deep(.script-editor-underline-error) {
  text-decoration-color: red;
}

:deep(.script-editor-underline-warning) {
  text-decoration-color: orange;
}

.intellisense {
  background-color: #ccc;
  position: absolute;
  top: v-bind('intellisenseTooltip.position.y');
  left: v-bind('intellisenseTooltip.position.x');
  transform: translate(0, calc(var(--editor-line-height) - 5px));
}

.intellisense-item-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid black;
}

.intellisense-item-list li {
  padding-inline: 5px;
  font-family: var(--editor-font-family);
  font-size: var(--editor-font-size);
  line-height: calc(var(--editor-line-height) * 0.8);
  display: flex;
  gap: 3rem;
  justify-content: space-between;
}
te .intellisense-item-list span:last-child {
  font-size: calc(var(--editor-font-size) * 0.8);
}

.intellisense-selected {
  background-color: rgb(189, 130, 130);
}

.error-title {
  position: absolute;
  top: v-bind('errorTooltip.position.y');
  left: v-bind('errorTooltip.position.x');
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
