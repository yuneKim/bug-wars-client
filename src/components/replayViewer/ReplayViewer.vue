<script setup lang="ts">
import type { BattleGrid } from '@/utils/replayUnsquasher';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const bugImgs: Record<number, string> = {
  0: new URL('@/assets/img/bug-red.png', import.meta.url).href,
  1: new URL('@/assets/img/bug-blue.png', import.meta.url).href,
  2: new URL('@/assets/img/bug-green.png', import.meta.url).href,
  3: new URL('@/assets/img/bug-purple.png', import.meta.url).href,
};

const props = defineProps<{
  frame: BattleGrid;
}>();

const battlefield = ref<HTMLDivElement>();

watch(() => battlefield, resizeHandler);

onMounted(() => window.addEventListener('resize', resizeHandler));
onUnmounted(() => window.removeEventListener('resize', resizeHandler));

function resizeHandler() {
  if (battlefield.value) {
    const width = battlefield.value.offsetWidth;
    battlefield.value.setAttribute('style', `height:${width}px`);
  }
}
</script>

<template>
  <div class="container">
    <div ref="battlefield" v-if="frame" class="battlefield">
      <template v-for="(row, y) in props.frame" :key="y">
        <div :class="`cell ${cell.type}`" v-for="(cell, x) in row" :key="x">
          <div
            v-if="cell.type === 'bug'"
            :class="`bug swarm-${cell.swarm + 1}`"
            :title="`${x}, ${y}`"
          >
            <img class="bug-img" :class="`face-${cell.direction}`" :src="bugImgs[cell.swarm]" />
          </div>
          <div class="food-cell" v-if="cell.type === 'food'">
            <img class="food-img" src="@/assets/img/food.png" />
          </div>
          <div v-if="cell.type === 'wall'">
            <img src="@/assets/img/wall.jpg" />
          </div>
          <div v-if="cell.type === 'empty'"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: inline-block;
  position: relative;
  z-index: 0;
}

.battlefield {
  display: grid;
  grid-template-columns: repeat(v-bind('props.frame[0].length'), 1fr);
  grid-template-rows: repeat(v-bind('props.frame.length'), 1fr);
  position: relative;
}

.battlefield::before {
  content: '';
  display: block;
  position: absolute;
  inset: 0;
  background-image: url('@/assets/img/blackstone-optimized.jpg');
  background-position: 20% 35%;
  filter: brightness(40%);
  z-index: -1;
}

img {
  display: block;
  width: 100%;
}

.row {
  display: flex;
}

.wall {
  background: #545454;
}

.bug,
.food-cell {
  position: relative;
}

.bug img,
.food-cell img {
  position: absolute;
  inset: 0;
}

.bug-img,
.food-img {
  z-index: 5;
}

.face-north {
  transform: rotate(0deg);
}

.face-east {
  transform: rotate(90deg);
}

.face-south {
  transform: rotate(180deg);
}

.face-west {
  transform: rotate(270deg);
}
</style>
