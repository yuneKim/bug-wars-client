import { scriptService } from '@/services/scriptService';
import { computed, ref } from 'vue';

export function useCompiler() {
  const byteCode = ref<number[]>([]);
  const compileError = ref('');

  const output = computed(() => compileError.value || JSON.stringify(byteCode.value));

  async function compileScript(code: string) {
    // replace all nbsp with spaces
    compileError.value = '';

    const response = await scriptService.parse({ code });

    if (response.type === 'success') {
      byteCode.value = response.data;
    } else {
      compileError.value = response.error;
    }
  }

  function setOutput(output: string) {
    byteCode.value = JSON.parse(output);
  }

  return {
    output,
    setOutput,
    compileScript,
  };
}
