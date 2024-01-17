<script setup lang="ts">
import { useCompiler } from '@/composables/useCompiler';
import { useScriptEditor } from '@/composables/useScriptEditor';
import { SCRIPT_EDITOR_OFFSET } from '@/config/constants';
import { scriptService } from '@/services/scriptService';
import type { Script, ScriptDto } from '@/types';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const script = ref<Script>({
  id: -1,
  name: '',
  raw: '',
  bytecode: '',
  isBytecodeValid: false,
});

const editTitle = ref(!route.params.id);
const errorMessage = ref('');
const successMessage = ref('');

watch(
  () => route.params.id,
  (id) => loadScript(id),
  { immediate: true },
);

const lineNumberDiv = ref<HTMLElement | null>(null);
const overlayDiv = ref<HTMLElement | null>(null);
const errorTooltipDiv = ref<HTMLElement | null>(null);

const {
  editorOptions,
  editorText,
  overlayContent,
  errorTooltip,
  lineNumbers,
  initializeQuill,
  intellisense,
  intellisenseTooltip,
  intellisenseClickHandler,
} = useScriptEditor({
  lineNumberDiv,
  overlayDiv,
  errorTooltipDiv,
});
const { output, setOutput, compileScript } = useCompiler();

async function loadScript(idString: string | string[]) {
  const scriptId = Number(idString);
  if (isNaN(scriptId)) return;
  const response = await scriptService.getScriptById(scriptId);

  if (response.type === 'success') {
    script.value = response.data;
    editorText.value = response.data.raw;
    setOutput(response.data.bytecode);
  } else {
    console.error('Uh oh');
  }
}

function save() {
  if (script.value.id < 0) {
    createScript();
  }
}

function validateScriptName() {
  if (script.value.name.length === 0) {
    errorMessage.value = 'Script name may not be blank.';
    return false;
  }
  return true;
}

function validateScriptBody() {
  if (script.value.raw.length === 0) {
    errorMessage.value = 'Script body may not be blank.';
    return false;
  }
  return true;
}

async function createScript() {
  if (!validateScriptName() || !validateScriptBody()) return;

  const scriptDto: ScriptDto = {
    name: script.value.name,
    raw: script.value.raw,
  };

  const response = await scriptService.createScript(scriptDto);
  if (response.type === 'success') {
    script.value.id = response.data.id;
    successMessage.value = 'Saved!';
  } else {
    errorMessage.value = response.error;
  }
}

function clearMessages() {
  errorMessage.value = '';
  successMessage.value = '';
}
</script>

<template>
  <main class="script-editing-window">
    <h1 class="header">Script Editor</h1>
    <div class="title-editor-wrapper">
      <div class="edit-title-wrapper" v-if="editTitle">
        <InputText
          type="text"
          placeholder="Name your script!"
          v-model="script.name"
          @input="clearMessages"
        />
        <Button
          type="button"
          @click="validateScriptName() ? (editTitle = false) : null"
          icon="pi pi-check-square"
          label="Confirm"
        />
      </div>
      <h2 class="title-header" v-else>
        {{ script?.name }}
        <Button
          type="button"
          icon="pi pi-pencil"
          label="Edit Name"
          @click="editTitle = true"
        ></Button>
      </h2>
    </div>
    <div class="editor-wrapper">
      <div ref="lineNumberDiv" class="line-numbers">
        <div class="line-number" v-for="n of lineNumbers" :key="n">{{ n }}</div>
      </div>
      <QuillEditor
        ref="testRef"
        :options="editorOptions"
        v-model:content="editorText"
        contentType="text"
        @textChange="intellisense"
        @ready="initializeQuill"
        @input="clearMessages"
      />
      >
      <div ref="overlayDiv" class="editor-overlay" v-html="overlayContent"></div>
    </div>
    <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    <div class="button-wrapper">
      <Button
        class="compile-button"
        type="button"
        icon="pi pi-wrench"
        label="Compile"
        @click="compileScript(editorText)"
      />
      <span class="success-message" v-if="successMessage"> {{ successMessage }}</span>
      <Button type="button" icon="pi pi-save" label="Save" @click="save" />
    </div>
    <h3 class="output-title">OUTPUT:</h3>
    <div class="output-text">{{ output }}</div>
  </main>
  <Teleport to="body">
    <div
      ref="intellisenseTooltipDiv"
      v-if="intellisenseTooltip.display && !intellisenseTooltip.preventDisplay"
      class="intellisense"
    >
      <ul class="intellisense-item-list">
        <li
          v-for="(item, index) in intellisenseTooltip.items"
          :key="item.value"
          :class="{ 'intellisense-selected': intellisenseTooltip.selectedItem === index }"
          @click="intellisenseClickHandler"
          @mousemove="intellisenseTooltip.selectedItem = index"
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
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-block: 50px;
  background-color: rgba(18, 18, 18, 0.85);
  color: #fff;
  padding: 50px;
  border: 0.5px solid white;
  border-radius: 2px;
  position: relative;
  z-index: 0;
}

.header {
  margin-block: 0 10px;
  text-transform: uppercase;
  text-align: center;
}

.title-editor-wrapper {
  display: flex;
  align-items: center;
  height: 3.5rem;
}
.title-editor-wrapper > * {
  flex-grow: 1;
}

.edit-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
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
  white-space: pre;
}

:deep(.ql-editor) *,
.editor-overlay,
:deep(.editor-overlay) * {
  font-family: var(--editor-font-family) !important;
  font-size: var(--editor-font-size) !important;
  line-height: var(--editor-line-height) !important;
}

:deep(.ql-editor) {
  padding-left: 0;
  left: v-bind('SCRIPT_EDITOR_OFFSET + "px"');
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

.button-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.intellisense {
  background: rgb(18, 18, 18);
  color: white;
  position: absolute;
  top: v-bind('intellisenseTooltip.position.y');
  left: v-bind('intellisenseTooltip.position.x');
  transform: translate(0, calc(var(--editor-line-height) - 5px));
}

.intellisense-item-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #fff;
}

.intellisense-item-list li {
  padding-inline: 5px;
  font-family: var(--editor-font-family);
  font-size: var(--editor-font-size);
  line-height: calc(var(--editor-line-height) * 0.8);
  display: flex;
  gap: 4rem;
  justify-content: space-between;
  cursor: pointer;
}
.intellisense-item-list span:last-child {
  font-size: calc(var(--editor-font-size) * 0.8);
}

.intellisense-selected {
  background: rgb(82, 14, 0);
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

.output-title {
  margin-top: 40px;
}

.output-text {
  font-family: var(--editor-font-family);
  font-size: var(--editor-font-size);
  line-height: var(--editor-line-height);
  border: 2px solid #ccc;
  padding: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  height: 10rem;
  overflow-y: auto;
}

.error-message {
  color: red;
}

.success-message {
  text-transform: uppercase;
  font-size: 1.4rem;
  color: rgb(0, 255, 0);
}
</style>
