<script setup lang="ts">
</script>

<template>
    <div>
        <!-- logo goes here -->
        <button><RouterLink :to="{name: 'gameLobby'}" data-test="gameLobby">Play Game</RouterLink></button>
        <button><RouterLink :to="{name: 'scripts'}" data-test="scriptEditor">Script Editor</RouterLink></button>
        <button><RouterLink :to="{name: 'howToPlay'}" data-test="howToPlay">How to Play</RouterLink></button>
        <button><RouterLink :to="{name: 'credits'}" data-test="credits">Credits</RouterLink></button>
    </div>
</template>

<style scoped></style>