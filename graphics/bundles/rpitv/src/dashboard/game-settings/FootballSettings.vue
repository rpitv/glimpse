<template>
	<h1>Football Settings</h1>

	<SyncableToggle name="Play Clock"
					v-model:enabled="replicants.gameSettings.football.playClock.value"
					v-model:synced="replicants.sync.values.football.playClock.value" />
	<SyncableToggle name="Downs" class="mt-10"
					v-model:enabled="replicants.gameSettings.football.downs.value"
					v-model:synced="replicants.sync.values.football.downs.value" />
	<SyncableToggle name="Yards To Go" class="mt-10"
					v-model:enabled="replicants.gameSettings.football.yardsToGo.value"
					v-model:synced="replicants.sync.values.football.yardsToGo.value" />
	<SyncableToggle name="Possession" class="mt-10"
					v-model:enabled="replicants.gameSettings.football.possession.value"
					v-model:synced="replicants.sync.values.football.possession.value" />
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
