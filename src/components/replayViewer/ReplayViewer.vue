<script setup lang="ts">
import { useReplayViewer } from '@/composables/useReplayViewer';
import { useRoute } from 'vue-router';

const route = useRoute();
const { frames, frameIndex, rewind, play, fastForward, pause, bugImgs } = useReplayViewer(
  route.query,
);
</script>

<template>
  <div class="container">
    <div v-if="frames.length > 0" class="battlefield">
      <div class="row" v-for="(row, y) in frames[frameIndex]" :key="y">
        <div :class="`cell ${cell.type}`" v-for="(cell, x) in row" :key="x">
          <div v-if="cell.type === 'bug'" :class="`swarm-${cell.swarm + 1}`" :title="`${x}, ${y}`">
            <img :class="`face-${cell.direction}`" :src="bugImgs[cell.swarm]" width="20" />
          </div>
          <div v-if="cell.type === 'food'">
            <img src="@/assets/img/food.jpg" />
          </div>
          <div v-if="cell.type === 'wall'">
            <img src="@/assets/img/wall.jpg" />
          </div>
          <div v-if="cell.type === 'empty'">
            <img src="@/assets/img/ground.jpg" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <button @click="frameIndex--" :disabled="frameIndex == 0">Previous</button>
    <button @click="frameIndex++" :disabled="frameIndex >= frames.length - 1">Next</button>
    <div>
      <input type="range" v-model="frameIndex" :min="0" :max="frames.length - 1" @input="pause" />
    </div>
  </div>
  <div class="vcr-controls">
    <button @click="rewind">{{ '<<' }}</button>
    <button @click="pause">{{ '||' }}</button>
    <button @click="play">{{ '>' }}</button>
    <button @click="fastForward">{{ '>>' }}</button>
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
  gap: 1px;
}

.row {
  display: flex;
  gap: 1px;
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

.bug {
  background-color: rgb(226, 226, 226);
}

.bug div {
  width: 100%;
  height: 100%;
  font-size: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swarm-1 {
  background-color: rgb(255, 0, 0);
}

.swarm-2 {
  background-color: rgb(255, 0, 255);
}

.swarm-3 {
  background-color: rgb(0, 0, 255);
}

.swarm-4 {
  background-color: rgb(255, 255, 0);
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

.vcr-controls {
  display: flex;
  gap: 1rem;
}

.vcr-controls button {
  width: 50px;
}
</style>
