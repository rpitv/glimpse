<template>
	<h1>Baseball Settings</h1>
	<SyncableToggle name="Bases"
					v-model:enabled="replicants.gameSettings.baseball.bases.value"/>
	<SyncableToggle name="Bottom/Top" class="mt-10"
					v-model:enabled="replicants.gameSettings.baseball.bottomTop.value"
					v-model:synced="replicants.sync.values.baseball.bottomTop.value"/>
	<SyncableToggle name="Outs/Strikes/Balls" class="mt-10"
					v-model:enabled="replicants.gameSettings.baseball.outsStrikesBalls.value"
					v-model:synced="replicants.sync.values.baseball.outsStrikesBalls.value"/>
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
