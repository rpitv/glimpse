<template>
	<div>
		<n-grid :cols="isAwayTeamEnabled && isHomeTeamEnabled ? 2 : 1" :x-gap="20">
			<n-grid-item v-if="isAwayTeamEnabled">
				<TeamControl v-model:score="awayTeamScore" :synced="awayTeamScoreSynced" />
			</n-grid-item>
			<n-grid-item v-if="isHomeTeamEnabled">
				<TeamControl v-model:score="homeTeamScore" :synced="homeTeamScoreSynced" />
			</n-grid-item>
		</n-grid>
	</div>
</template>

<script setup lang="ts">
import {NGrid, NGridItem} from "naive-ui";
import TeamControl from "./TeamControl.vue";
import {loadReplicants} from "../../browser-common/replicants";

const replicants = await loadReplicants();

const homeTeam = replicants.teams[0];
const awayTeam = replicants.teams[1];

const isHomeTeamEnabled = homeTeam.enabled;
const isAwayTeamEnabled = awayTeam.enabled;

const homeTeamScore = homeTeam.score;
const awayTeamScore = awayTeam.score;

const homeTeamScoreSynced = replicants.sync.values.teams[0].score;
const awayTeamScoreSynced = replicants.sync.values.teams[1].score;
</script>

<style scoped lang="scss">
</style>
