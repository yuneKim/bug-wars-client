import { scriptService } from '@/services/scriptService';
import type { Script, ScriptDto } from '@/types';
import { ref, watch, type Ref } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

type Props = {
  editorText: Ref<string>;
  route: RouteLocationNormalizedLoaded;
  setText: Function;
  setOutput: Function;
};

export function useScriptCrud({ editorText, route, setText, setOutput }: Props) {
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

  watch(editorText, (text) => (script.value.raw = text));

  watch(
    () => route.params.id,
    (id) => loadScript(id),
    { immediate: true },
  );

  async function loadScript(idString: string | string[]) {
    const scriptId = Number(idString);
    if (isNaN(scriptId)) return;
    const response = await scriptService.getScriptById(scriptId);

    if (response.type === 'success') {
      script.value = response.data;
      setText(script.value.raw);
      setOutput(response.data.bytecode);
    } else {
      console.error('Uh oh');
    }
  }

  function save() {
    if (script.value.id < 0) {
      createScript();
    } else {
      updateScript();
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

  async function updateScript() {
    if (!validateScriptName() || !validateScriptBody()) return;

    const scriptDto: ScriptDto = {
      name: script.value.name,
      raw: script.value.raw,
    };

    const response = await scriptService.updateScript(script.value.id, scriptDto);
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

  return {
    script,
    editTitle,
    errorMessage,
    successMessage,
    validateScriptName,
    clearMessages,
    save,
  };
}
