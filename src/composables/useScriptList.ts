import { scriptService } from '@/services/scriptService';
import type { Script } from '@/types';
import { ref } from 'vue';

export function useScriptList() {
  const scripts = ref<Script[]>([]);
  const showDialog = ref(false);
  const deleteId = ref(0);
  const errorMessage = ref('');

  async function loadScripts() {
    const response = await scriptService.getAllScripts();

    if (response.type === 'success') {
      scripts.value = response.data;
    } else {
      errorMessage.value = response.error;
    }
  }

  function openModal(id: number) {
    clearError();
    showDialog.value = true;
    deleteId.value = id;
  }

  async function deleteScript() {
    clearError();
    const response = await scriptService.deleteScriptById(deleteId.value);
    if (response.type === 'success') {
      loadScripts();
    } else {
      errorMessage.value = response.error;
    }
    showDialog.value = false;
  }

  function clearError() {
    errorMessage.value = '';
  }

  return {
    scripts,
    showDialog,
    deleteId,
    errorMessage,
    loadScripts,
    openModal,
    deleteScript,
    clearError,
  };
}
