<script setup lang="ts">
import { useScriptList } from '@/composables/useScriptList';
import 'primeicons/primeicons.css';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { RouterLink } from 'vue-router';

const { scripts, showDialog, errorMessage, loadScripts, openModal, deleteScript } = useScriptList();

await loadScripts();
</script>

<template>
  <div class="lil-container">
    <div class="littler-container">
      <h1 class="header">Your Scripts</h1>
      <ul class="list-container">
        <li v-for="script in scripts" :key="script.id" class="list-item" data-test="script">
          <!-- validation check marks -->
          <div class="script-container">
            <span
              v-if="script.bytecodeValid"
              class="pi pi-check"
              style="color: greenyellow"
              data-test="validation true"
            ></span>
            <span
              v-else
              class="pi pi-times"
              style="color: #f00000"
              data-test="validation false"
            ></span>

            <RouterLink
              class="script-name"
              :to="{ name: 'scriptEditor', params: { id: script.id } }"
              >{{ script.name }}</RouterLink
            >
          </div>
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
  margin-inline: 10px;
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

.script-container {
  display: flex;
  gap: 14px;
  align-items: center;
}

.script-name {
  position: relative;
  top: 1px;
}

@media screen and (max-width: 600px) {
  .littler-container {
    padding-inline: 20px;
  }
}
</style>
