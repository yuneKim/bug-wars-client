<script setup lang="ts">
import ReplayViewer from '@/components/replayViewer/ReplayViewer.vue';
import { useReplayViewer } from '@/composables/useReplayViewer';
import Button from 'primevue/button';
import Slider from 'primevue/slider';
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
  scoreboard,
  topBugs,
} = useReplayViewer(route.query);
</script>

<template>
  <div class="game-container">
    <div class="scoreboard">
      <template v-for="topBug in topBugs" :key="topBug">
        <img :src="bugImgs[topBug]" />
        <span class="score">{{ scoreboard[topBug].scores[frameIndex] }}</span>
        <span>{{ scoreboard[topBug].name }}</span>
      </template>
    </div>
    <div>
      <ReplayViewer :frame="frames[frameIndex]" />
    </div>
    <div></div>
    <div></div>
    <div class="replay-controls">
      <div>
        <Slider
          class="slider"
          v-model="frameIndex"
          :min="0"
          :max="frames.length - 1"
          @input="pause"
        />
      </div>
      <div class="vcr-controls">
        <div>
          <Button @click="rewind">{{ '|<' }}</Button>
          <Button v-if="showPause" @click="pause">{{ '||' }}</Button>
          <Button v-else @click="play(500)">{{ '>' }}</Button>
          <Button @click="play(100)">{{ '>>' }}</Button>
          <Button @click="play(30)">{{ '>>>' }}</Button>
        </div>
        <div>
          <Button @click="prevFrame" :disabled="frameIndex == 0">{{ '<|' }}</Button>
          <Button @click="nextFrame" :disabled="frameIndex >= frames.length - 1">
            {{ '|>' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto 1fr;
}

.scoreboard {
  justify-self: end;
  align-self: center;
  margin-right: 5rem;

  display: grid;
  grid-template-columns: auto 1.5rem auto;
  row-gap: 0.5rem;
  column-gap: 1rem;
}

.score {
  justify-self: right;
}

.leader-star {
  display: inline-block;
  width: 20px;
  color: gold;
}

.replay-controls {
  padding-block: 1rem;
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
