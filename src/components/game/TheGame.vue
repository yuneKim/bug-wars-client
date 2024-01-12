<script setup lang="ts">
import ReplayViewer from '@/components/replayViewer/ReplayViewer.vue';
import { useReplayViewer } from '@/composables/useReplayViewer';
import { useRoute } from 'vue-router';

const bugImgs: Record<number, string> = {
  0: new URL('@/assets/img/bug-red.png', import.meta.url).href,
  1: new URL('@/assets/img/bug-blue.png', import.meta.url).href,
  2: new URL('@/assets/img/bug-green.png', import.meta.url).href,
  3: new URL('@/assets/img/bug-purple.png', import.meta.url).href,
};

const route = useRoute();

const {
  frames,
  frameIndex,
  rewind,
  play,
  pause,
  showPause,
  prevFrame,
  nextFrame,
  scoreBoard,
  topBugs,
} = useReplayViewer(route.query);
</script>

<template>
  <div class="game-container">
    <div class="game-wrapper">
      <div class="scoreboard">
        <div v-for="(swarm, n) in scoreBoard" :key="n">
          <span class="leader-star" v-show="topBugs.includes(n)">&starf;</span>
          <span>{{ swarm.name }}</span>
          <span>{{ swarm.scores[frameIndex] }}</span>
          <img :src="bugImgs[n]" />
        </div>
      </div>
      <div>
        <ReplayViewer :frame="frames[frameIndex]" />
      </div>
      <div>
        <div>
          <input
            class="slider"
            type="range"
            v-model="frameIndex"
            :min="0"
            :max="frames.length - 1"
            @input="pause"
          />
        </div>
      </div>
      <div class="vcr-controls">
        <div>
          <button @click="rewind">{{ '|<' }}</button>
          <button v-if="showPause" @click="pause">{{ '||' }}</button>
          <button v-else @click="play(500)">{{ '>' }}</button>
          <button @click="play(100)">{{ '>>' }}</button>
          <button @click="play(30)">{{ '>>>' }}</button>
        </div>
        <div>
          <button @click="prevFrame" :disabled="frameIndex == 0">{{ '<|' }}</button>
          <button @click="nextFrame" :disabled="frameIndex >= frames.length - 1">
            {{ '|>' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  justify-content: center;
}

.leader-star {
  display: inline-block;
  width: 20px;
  color: gold;
}

.game-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vcr-controls {
  display: flex;
  justify-content: space-between;
}

.vcr-controls div {
  display: flex;
  gap: 1rem;
}

.vcr-controls button {
  width: 50px;
}

.slider {
  width: 100%;
}
</style>
