<template>
	<h1>Football Settings</h1>

	<SyncableToggle name="Play Clock"
					v-model:enabled="replicants.gameSettings.football.playClock.enabled.value"
					v-model:synced="replicants.gameSettings.football.playClock.synced.value" />
	<SyncableToggle name="Downs" class="mt-10"
					v-model:enabled="replicants.gameSettings.football.downs.enabled.value"
					v-model:synced="replicants.gameSettings.football.downs.synced.value" />
	<SyncableToggle name="Possession" class="mt-10"
					v-model:enabled="replicants.gameSettings.football.possession.enabled.value"
					v-model:synced="replicants.gameSettings.football.possession.synced.value" />
</template>

<script setup lang="ts">
	import SyncableToggle from "./SyncableToggle.vue";
	import {loadReplicants} from "../../browser-common/replicants";

	const replicants = await loadReplicants();
</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}
</style>
