<template>
	<div class="game-settings">
		<n-grid x-gap="12" :cols="4">
			<n-grid-item>
				<h1>Style</h1>
				<n-select :options="styles" v-model:value="replicants.gameSettings.style.value" />
				<h1>Presets</h1>
				<n-select disabled title="Coming Soon" filterable :options="sportsPresetList"
						  v-model:value="selectedSportPreset"/>
				<n-button class="mt-10" :disabled="selectedSportPreset === null">Load Preset</n-button>
			</n-grid-item>

			<n-grid-item>
				<FootballSettings />
				<BaseballSettings />
			</n-grid-item>

			<n-grid-item>
				<TeamSettings :id="0" name="Home" />
			</n-grid-item>
			<n-grid-item>
				<TeamSettings :id="1" name="Away" />
			</n-grid-item>
		</n-grid>
	</div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {loadReplicants} from "../../browser-common/replicants";
import {NSelect, NButton, NGrid, NGridItem} from "naive-ui";
import FootballSettings from "./FootballSettings.vue";
import BaseballSettings from "./BaseballSettings.vue";
import TeamSettings from "./TeamSettings.vue";

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
