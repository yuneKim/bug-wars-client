<script setup lang="ts">
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import TheGame from '@/components/game/TheGame.vue';
</script>

<template>
  <Suspense>
    <template #fallback>
      <LoadingSpinner />
    </template>
    <TheGame />
  </Suspense>
</template>

<style scoped></style>
