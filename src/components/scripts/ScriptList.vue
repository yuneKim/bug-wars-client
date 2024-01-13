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
          <Button type="button" @click="showDialog = true" data-test="delete-button" icon="pi pi-trash"></Button>
        </li>
      </ul>
      <Dialog v-model:visible="showDialog" modal header="test header" data-test="dialog"
        ><p>dummy text</p></Dialog
      >
        <Button class="create-script-btn">
          <RouterLink :to="{ name: 'scriptEditor' }">Create Script</RouterLink>
        </Button>
      
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
  border: .5px solid white;
  background-color: rgba(18, 18, 18, .85);
  border-radius: 2px;
  margin-top: 50px;
  padding: 20px;
}

.littler-container a {
  text-decoration: none;
  color: #fff;
}

.list-container a:hover {
  transition: ease-in-out .2s;
  color: #ff0000;
}

.header {
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
  border: .5px solid white;
}

.create-script-btn a {
  position: relative;
  top: 1px;

}


</style>
