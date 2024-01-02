import { scriptService } from '@/services/scriptService';
import axios from 'axios';
import { computed, ref } from 'vue';

export function useCompiler() {
  const byteCode = ref<number[]>([]);
  const compileError = ref('');

  const output = computed(() => compileError.value || JSON.stringify(byteCode.value));

  async function compileScript(code: string) {
    compileError.value = '';
    try {
      const response = await scriptService.parse({ code });
      if (response.status === 200) {
        byteCode.value = response.data;
      }
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleCompileError(error);
    }
  }

  function handleCompileError(error: Error) {
    if (!axios.isAxiosError(error)) {
      console.error('Non-axios error:', error);
      return;
    }

    if (error.response?.status === 422) {
      compileError.value = error.response.data.message;
    } else {
      compileError.value = 'Something went wrong on our end. Try again later.';
    }
  }

  return {
    byteCode,
    output,
    compileScript,
  };
}
