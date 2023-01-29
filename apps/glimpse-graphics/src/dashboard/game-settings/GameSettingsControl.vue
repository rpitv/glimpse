<template>
	<div class="game-settings">
		<n-grid x-gap="12" :cols="4">
			<n-grid-item>
				<h1>Style</h1>
				<n-select :options="styles" v-model:value="replicants.gameSettings.style.value"/>

				<h1>Presets</h1>
				<n-select disabled title="Coming Soon" filterable :options="sportsPresetList"
						  v-model:value="selectedSportPreset"/>
				<n-button class="mt-10" :disabled="selectedSportPreset === null">Load Preset</n-button>

				<h1>API</h1>
				<n-checkbox v-model:checked="replicants.gameSettings.api.enabled.value">Enable API</n-checkbox>
				<div v-if="replicants.gameSettings.api.enabled.value">
					<p class="mt-10">API KEY</p>
					<n-input :on-update:value="(string) => replicants.gameSettings.api.key.value = string"
							 :default-value="replicants.gameSettings.api.key.value"
							 placeholder="Enter an API Key"/>
				</div>
			</n-grid-item>

			<n-grid-item>
			</n-grid-item>

			<n-grid-item>
				<BaseballSettings/>
			</n-grid-item>
		</n-grid>
	</div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {loadReplicants} from "../../browser-common/replicants";
import {NSelect, NButton, NGrid, NGridItem, NCheckbox, NInput} from "naive-ui";
import FootballSettings from "./FootballSettings.vue";
import BaseballSettings from "./BaseballSettings.vue";

const replicants = await loadReplicants();

const styles = ref([
	{
		label: 'ESPN',
		value: 'espn'
	},
	{
		label: 'RPI TV (Modern)',
		value: 'rpitv-modern'
	},
	{
		label: 'RPI TV (Classic)',
		value: 'rpitv-classic'
	}
]);
const selectedSportPreset = ref(null);
const sportsPresetList = ref([
	{
		label: 'Men\'s Ice Hockey',
		value: 'mhockey'
	},
	{
		label: 'Women\'s Ice Hockey',
		value: 'whockey'
	},
	{
		label: 'Football',
		value: 'football'
	},
	{
		label: 'Men\'s Basketball',
		value: 'mbasketball'
	},
	{
		label: 'Women\'s Basketball',
		value: 'wbasketball'
	},
	{
		label: 'Men\'s Soccer',
		value: 'msoccer'
	},
	{
		label: 'Women\'s Soccer',
		value: 'wsoccer'
	},
	{
		label: 'Baseball',
		value: 'baseball'
	}
]);
</script>

<style scoped lang="scss">
.game-settings {
	min-height: 400px;
}

.mt-10 {
	margin-top: 10px;
}
</style>
