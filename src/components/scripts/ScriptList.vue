<script setup lang="ts">
import type { Script } from '@/types';
import { ref, onMounted } from 'vue';
import { scriptService } from '@/services/scriptService';
import { RouterLink } from 'vue-router';

const scripts = ref<Script[]>([]);

onMounted(loadScripts);

async function loadScripts() {
  const response = await scriptService.getAllScripts();

  if (response.type === 'success') {
    scripts.value = response.data;
  } else {
    console.error("Uh oh");
  }

}

</script>

<template>
  <h1>Your Scripts</h1>
  <ul>
    <li v-for="script in scripts" :key="script.id"><RouterLink :to="{name:'scriptEditor', params:{id:script.id}}">{{ script.name }}</RouterLink></li>
  </ul>
</template>

<style scoped></style>
