<template>
	<h1>Baseball Settings</h1>
	<SyncableToggle name="Bases"
					v-model:enabled="replicants.gameSettings.baseball.bases.enabled.value"
					v-model:synced="replicants.gameSettings.baseball.bases.synced.value"/>
	<SyncableToggle name="Bottom/Top" class="mt-10"
					v-model:enabled="replicants.gameSettings.baseball.bottomTop.enabled.value"
					v-model:synced="replicants.gameSettings.baseball.bottomTop.synced.value"/>
	<SyncableToggle name="Outs/Strikes/Balls" class="mt-10"
					v-model:enabled="replicants.gameSettings.baseball.outsStrikesBalls.enabled.value"
					v-model:synced="replicants.gameSettings.baseball.outsStrikesBalls.synced.value"/>
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
