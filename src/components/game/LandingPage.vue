<script setup lang="ts">
</script>

<template>
    <div>
        <!-- logo goes here -->
        <button><RouterLink v-bind:to="{name: 'gameLobby'}" data-test="gameLobby">Play Game</RouterLink></button>
        <button><RouterLink v-bind:to="{name: 'scriptEditor'}" data-test="scriptEditor">Script Editor</RouterLink></button>
        <button><RouterLink v-bind:to="{name: 'howToPlay'}" data-test="howToPlay">How to Play</RouterLink></button>
        <button><RouterLink v-bind:to="{name: 'credits'}" data-test="credits">Credits</RouterLink></button>
    </div>
</template>

<style scoped></style>