<script setup lang="ts">
import { scriptService } from '@/services/scriptService';
import type { Script } from '@/types';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const scripts = ref<Script[]>([]);
const showDialog = ref(false);

onMounted(loadScripts);

async function loadScripts() {
  const response = await scriptService.getAllScripts();

  if (response.type === 'success') {
    scripts.value = response.data;
  } else {
    console.error('Uh oh');
  }
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
          <Button type="button" @click="showDialog = true" data-test="delete-button">Delete</Button>
        </li>
      </ul>
      <Dialog v-model:visible="showDialog" modal header="test header" data-test="dialog"
        ><p>dummy text</p></Dialog
      >
      <RouterLink :to="{ name: 'scriptEditor' }">Create Script</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.lil-container {
  display: flex;
  justify-content: center;
}

.header {
  text-align: center;
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
}
</style>
