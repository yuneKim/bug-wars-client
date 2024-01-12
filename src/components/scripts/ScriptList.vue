<script setup lang="ts">
import type { Script } from '@/types';
import { ref, onMounted } from 'vue';
import { scriptService } from '@/services/scriptService';
import { RouterLink } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

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
        <li v-for="script in scripts" :key="script.id" class="list-item">
          <RouterLink :to="{ name: 'scriptEditor', params: { id: script.id } }">{{
            script.name
          }}</RouterLink>
          <Button type="button" @click="showDialog = true">Delete</Button>
        </li>
      </ul>
      <Dialog v-model:visible="showDialog" modal header="test header"><p>dummy text</p></Dialog>
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

.p-button {
  justify-content: center;
  background: red;
  border-radius: 0;
  border-color: red;
  padding-block: 5px;
}
</style>
