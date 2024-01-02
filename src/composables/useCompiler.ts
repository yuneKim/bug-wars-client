import { scriptService } from '@/services/scriptService';
import { makeRequest } from '@/utils/makeRequest';
import { computed, ref } from 'vue';

export function useCompiler() {
  const byteCode = ref<number[]>([]);
  const compileError = ref('');

  const output = computed(() => compileError.value || JSON.stringify(byteCode.value));

  async function compileScript(code: string) {
    compileError.value = '';

    const response = await makeRequest(() => scriptService.parse({ code }), {
      successStatuses: [200],
      errorStatuses: {
        422: (response) => response.data.message,
      },
    });

    if (response.type === 'success') {
      byteCode.value = response.data;
    } else {
      compileError.value = response.error;
    }
  }

  return {
    byteCode,
    output,
    compileScript,
  };
}
