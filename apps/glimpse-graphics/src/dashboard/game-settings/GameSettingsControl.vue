<template>
	<div class="game-settings">
		<n-grid x-gap="12" :cols="4">
			<n-grid-item>
				<h1>Presets</h1>
				<n-select disabled title="Coming Soon" filterable :options="sportsPresetList"
						  v-model:value="selectedSportPreset"/>
				<n-button class="mt-10" :disabled="selectedSportPreset === null">Load Preset</n-button>

				<ClockSettings />
			</n-grid-item>

			<n-grid-item>
				<FootballSettings />
				<BaseballSettings />
			</n-grid-item>

			<n-grid-item>
				<h1>Home Team</h1>
			</n-grid-item>
			<n-grid-item>
				<h1>Away Team</h1>
			</n-grid-item>
		</n-grid>
	</div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {NSelect, NButton, NGrid, NGridItem} from "naive-ui";
import ClockSettings from "./ClockSettings.vue";
import FootballSettings from "./FootballSettings.vue";
import BaseballSettings from "./BaseballSettings.vue";

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
