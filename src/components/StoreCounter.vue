<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';

const counterStore = useCounterStore();
const { increment } = counterStore;
const { count } = storeToRefs(counterStore);
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
