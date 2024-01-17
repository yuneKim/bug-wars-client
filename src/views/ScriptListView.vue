<script setup lang="ts">
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import ScriptList from '@/components/scripts/ScriptList.vue';
</script>

<template>
  <Suspense>
    <template #fallback>
      <LoadingSpinner />
    </template>
    <ScriptList />
  </Suspense>
</template>

<style scoped></style>
