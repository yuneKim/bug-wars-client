<script setup lang="ts">
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import GameLobby from '@/components/game/GameLobby.vue';
</script>

<template>
  <Suspense>
    <template #fallback>
      <LoadingSpinner />
    </template>
    <GameLobby />
  </Suspense>
</template>

<style scoped></style>
