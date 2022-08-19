<template>
	<h1>Football Settings</h1>

	<SyncableToggle name="Play Clock" @update-enabled="$val => playClockEnabledValue = $val" replicant-namespace="glimpse-graphics.game-settings.football.playClock" />
	<div class="mt-10" v-if="playClockEnabledValue">
		<label :for="playClockLengthId">Play Clock Length</label>
		<n-input :id="playClockLengthId" placeholder="0:40.0" v-model="playClockLengthValue"/>
	</div>
	<SyncableToggle name="Downs" replicant-namespace="glimpse-graphics.game-settings.football.downs" class="mt-10" />
	<SyncableToggle name="Possession" replicant-namespace="glimpse-graphics.game-settings.football.possession" class="mt-10" />
</template>

<script setup lang="ts">
	import SyncableToggle from "./SyncableToggle.vue";
	import {ref} from "vue";
	import {v4} from "uuid";
	import {NInput} from "naive-ui";
	import {replicant} from "../../browser-common/replicant";

	const playClockLengthId = v4();

	const playClockEnabledValue = ref<boolean>(false);

	const playClockLengthValue = replicant<string>('playClockLength', 'glimpse-graphics.game-settings.football');
</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}
</style>
