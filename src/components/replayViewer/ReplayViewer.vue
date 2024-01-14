<script setup lang="ts">
import type { BattleGrid } from '@/utils/replayUnsquasher';

const bugImgs: Record<number, string> = {
  0: new URL('@/assets/img/bug-red.png', import.meta.url).href,
  1: new URL('@/assets/img/bug-blue.png', import.meta.url).href,
  2: new URL('@/assets/img/bug-green.png', import.meta.url).href,
  3: new URL('@/assets/img/bug-purple.png', import.meta.url).href,
};

const props = defineProps<{
  frame: BattleGrid;
}>();
</script>

<template>
  <div class="container">
    <div v-if="frame" class="battlefield">
      <div class="row" v-for="(row, y) in props.frame" :key="y">
        <div :class="`cell ${cell.type}`" v-for="(cell, x) in row" :key="x">
          <div
            v-if="cell.type === 'bug'"
            :class="`bug swarm-${cell.swarm + 1}`"
            :title="`${x}, ${y}`"
          >
            <img
              class="bug-img"
              :class="`face-${cell.direction}`"
              :src="bugImgs[cell.swarm]"
              width="20"
            />
          </div>
          <div class="food-cell" v-if="cell.type === 'food'">
            <img class="food-img" src="@/assets/img/food.png" />
          </div>
          <div v-if="cell.type === 'wall'">
            <img src="@/assets/img/wall.jpg" />
          </div>
          <div v-if="cell.type === 'empty'"></div>
        </div>
      </div>
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
  padding: 1px;
  /* background: #545454; toggle grid lines */
  display: flex;
  flex-direction: column;
  position: relative;
}

.battlefield::before {
  content: '';
  display: block;
  position: absolute;
  inset: 0;
  background-image: url('@/assets/img/blackstone.jpg');
  background-position: 20% 35%;
  filter: brightness(70%);
  z-index: -1;
}

.row {
  display: flex;
}

.cell {
  width: 20px;
  height: 20px;
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
