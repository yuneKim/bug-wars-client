<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div>
    <h1>Game Lobby</h1>
  </div>
  <button @click="router.push({ name: 'replayViewer' })">Start Game</button>
</template>

<style scoped></style>
