<template>
	<h1>Baseball Settings</h1>
	<SyncableToggle name="Bases" replicant-namespace="glimpse-graphics.game-settings.baseball.bases" />
	<SyncableToggle name="Bottom/Top" replicant-namespace="glimpse-graphics.game-settings.baseball.bottomTop" class="mt-10" />
	<SyncableToggle name="Outs/Strikes/Balls" replicant-namespace="glimpse-graphics.game-settings.baseball.outsStrikesBalls" class="mt-10" />
</template>

<script setup lang="ts">
import SyncableToggle from "./SyncableToggle.vue";
</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}
</style>
