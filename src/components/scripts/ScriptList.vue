<script setup lang="ts">
import { scriptService } from '@/services/scriptService';
import type { Script } from '@/types';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const scripts = ref<Script[]>([]);
const showDialog = ref(false);
const deleteId = ref(0);
const errorMessage = ref('');

onMounted(loadScripts);

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
</script>

<template>
  <div class="lil-container">
    <div class="littler-container">
      <h1 class="header">Your Scripts</h1>
      <ul class="list-container">
        <li v-for="script in scripts" :key="script.id" class="list-item" data-test="script">
          <RouterLink :to="{ name: 'scriptEditor', params: { id: script.id } }">{{
            script.name
          }}</RouterLink>
          <Button
            type="button"
            @click="openModal(script.id)"
            data-test="delete-button"
            icon="pi pi-trash"
            class="trash"
          ></Button>
        </li>
      </ul>
      <Dialog
        v-model:visible="showDialog"
        modal
        dismissable-mask
        header="Are you sure?"
        data-test="dialog"
        class="delete-modal"
      >
        <Button type="button" @click="deleteScript()" data-test="real-delete-button"
          >Delete</Button
        ></Dialog
      >
      <Divider class="divider" />
      <Button class="create-script-btn">
        <RouterLink :to="{ name: 'scriptEditor' }">Create Script</RouterLink>
      </Button>
      <p class="error-message">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.lil-container {
  display: flex;
  justify-content: center;
  text-transform: uppercase;
}

.littler-container {
  border: 0.5px solid white;
  background-color: rgba(18, 18, 18, 0.85);
  border-radius: 2px;
  margin-top: 50px;
  padding: 50px;
  max-width: 500px;
  width: 100%;
}

.littler-container a {
  text-decoration: none;
  color: #fff;
}

.list-container a:hover {
  transition: ease-in-out 0.2s;
  color: #ff0000;
}

.header {
  margin-top: 0;
  margin-bottom: 40px;
  text-align: center;
  color: #fff;
}

.list-container {
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list-item {
  list-style: none;
  display: flex;
  justify-content: space-between;
  gap: 50px;
  align-items: center;
  padding: 10px;
  border-radius: 2px;
  border: 0.5px solid white;
}

.create-script-btn {
  margin-top: 30px;
}

.create-script-btn a {
  position: relative;
  top: 1px;
}
.error-message {
  color: red;
}
</style>
