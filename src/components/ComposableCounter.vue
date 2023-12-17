<script setup lang="ts">
import { useCounter } from '@/composables/counter';

const { count, increment } = useCounter();
</script>

<template>
  <div class="counter">
    <div>Count: {{ count }}</div>
    <button type="button" @click="increment">Increment</button>
  </div>
</template>

<style scoped>
.counter {
  border: 1px solid black;
  padding: 10px;
}
</style>
