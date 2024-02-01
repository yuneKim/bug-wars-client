import { scriptService } from '@/services/scriptService';
import type { Script, ScriptDto } from '@/types';
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';
import { ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';

type Props = {
  editorText: Ref<string>;
  setOutput: Function;
};

export function useScriptCrud({ editorText, setOutput }: Props) {
  const route = useRoute();

  const script = ref<Script>({
    id: -1,
    name: '',
    raw: '',
    bytecode: '',
    bytecodeValid: false,
  });

  const editTitle = ref(!route.params.id);
  const errorMessage = ref('');
  const successMessage = ref('');

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
      editorText.value = script.value.raw;
      setOutput(response.data.bytecode);
    } else {
      errorMessage.value = response.error;
    }
  }

  function save() {
    if (script.value.id < 0) {
      createScript();
    } else {
      updateScript();
    }
  }

  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  function validateScriptName() {
    if (script.value.name.length === 0) {
      errorMessage.value = 'Script name may not be blank.';
      return false;
    }else if (script.value.name.length > 20) {
      errorMessage.value = 'Script name must be 20 characters or fewer.';
      return false;
    }
    if (matcher.hasMatch(script.value.name)) {
      errorMessage.value = 'Script name may not contain inappropriate language.';
      return false;
    }
    return true;
  }

  function validateScriptBody() {
    if (editorText.value.length === 0) {
      errorMessage.value = 'Script body may not be blank.';
      return false;
    }
    return true;
  }

  async function createScript() {
    if (!validateScriptName() || !validateScriptBody()) return;

    const scriptDto: ScriptDto = {
      name: script.value.name,
      raw: editorText.value,
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
      raw: editorText.value,
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
