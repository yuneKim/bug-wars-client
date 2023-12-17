<script setup lang="ts">
import ComposableCounter from '@/components/ComposableCounter.vue';
import StoreCounter from '@/components/StoreCounter.vue';
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>Composable Counters</h2>
    <div class="counters">
      <ComposableCounter />
      <ComposableCounter />
      <ComposableCounter />
    </div>
    <h2>Pinia Store Counters</h2>
    <div class="counters">
      <StoreCounter />
      <StoreCounter />
      <StoreCounter />
    </div>
  </div>
</template>

<style>
.counters {
  display: flex;
  gap: 20px;
}
</style>
