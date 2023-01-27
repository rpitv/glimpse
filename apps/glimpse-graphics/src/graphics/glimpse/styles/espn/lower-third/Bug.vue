<template>
    <img :src="bug">
</template>

<script setup lang="ts">
import bug from "../../../../../assets/espn/espnBug.png";

</script>

<style scoped>
img {
    position: absolute;
    top: 1vh;
    left: 0;
    width: 100vw;
    height: 100vh;
}

</style>