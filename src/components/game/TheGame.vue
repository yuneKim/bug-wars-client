<script setup lang="ts">
import ReplayViewer from '@/components/replayViewer/ReplayViewer.vue';
import { useReplayViewer } from '@/composables/useReplayViewer';
import { useRoute } from 'vue-router';

const route = useRoute();

const { frames, frameIndex, rewind, play, pause, showPause, prevFrame, nextFrame } =
  useReplayViewer(route.query);
</script>

<template>
  <div class="game-container">
    <div class="game-wrapper">
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
