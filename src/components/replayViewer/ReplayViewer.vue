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

function randomDirection() {
  const directions = ['face-north', 'face-east', 'face-south', 'face-west'];
  return directions[Math.floor(Math.random() * directions.length)];
}
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
            <img src="@/assets/img/dark-ground.jpg" />
            <img
              class="bug-img"
              :class="`face-${cell.direction}`"
              :src="bugImgs[cell.swarm]"
              width="20"
            />
          </div>
          <div class="food-cell" v-if="cell.type === 'food'">
            <img src="@/assets/img/dark-ground.jpg" />
            <img class="food-img" src="@/assets/img/food.png" />
          </div>
          <div v-if="cell.type === 'wall'">
            <img src="@/assets/img/wall.jpg" />
          </div>
          <div v-if="cell.type === 'empty'">
            <img src="@/assets/img/dark-ground.jpg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: inline-block;
}

.battlefield {
  padding: 1px;
  /* background: #545454; toggle grid lines */
  background: black;
  display: flex;
  flex-direction: column;
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

.empty {
  background-color: #000;
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
