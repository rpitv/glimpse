<template>
	<div>
		<n-grid :cols="gridColumns">
			<n-grid-item v-if="isAwayTeamEnabled" :span="4">
				<div class="team-display">
					<img v-if="awayTeamLogo" :src="awayTeamLogo" alt="Away Team Logo"/>
					<h1>{{ awayTeamName }}</h1>
				</div>
				<div class="score">{{ awayTeamScore }}</div>
			</n-grid-item>
			<n-grid-item v-if="isHomeTeamEnabled && isAwayTeamEnabled" :span="1" class="versus">
				<p>vs.</p>
			</n-grid-item>
			<n-grid-item v-if="isHomeTeamEnabled" :span="4">
				<div class="team-display">
					<img v-if="homeTeamLogo" :src="homeTeamLogo" alt="Home Team Logo"/>
					<h1>{{ homeTeamName }}</h1>
				</div>
				<div class="score">{{ homeTeamScore }}</div>
			</n-grid-item>
			<n-grid-item v-if="!isAwayTeamEnabled && !isHomeTeamEnabled">
				<p class="disabled-message">Both teams are disabled.</p>
			</n-grid-item>
		</n-grid>
	</div>
</template>

<script setup lang="ts">
import {NGrid, NGridItem} from "naive-ui";
import {loadReplicants} from "../../browser-common/replicants";
import {computed} from "vue";

const replicants = await loadReplicants();

const homeTeam = replicants.teams[0];
const awayTeam = replicants.teams[1];

const isHomeTeamEnabled = homeTeam.enabled;
const isAwayTeamEnabled = awayTeam.enabled;

const homeTeamLogo = homeTeam.logo;
const awayTeamLogo = awayTeam.logo;

const homeTeamName = homeTeam.name;
const awayTeamName = awayTeam.name;

const homeTeamScore = homeTeam.score;
const awayTeamScore = awayTeam.score;

const gridColumns = computed(() => {
	if (isHomeTeamEnabled.value && isAwayTeamEnabled.value) {
		return 9;
	} else if (isHomeTeamEnabled.value || isAwayTeamEnabled.value) {
		return 4;
	} else {
		return 1;
	}
});
</script>

<style scoped lang="scss">
.team-display {
	display: flex;
	justify-content: center;
	align-items: center;
}

img {
	height: 50px;
	margin: 0 10px;
}

.score {
	text-align: center;
	font-size: 4em;
	font-weight: bold;
}

.versus {
	display: flex;
	flex-direction: column;
	justify-content: center;
	p {
		text-align: center;
		font-size: 1.5em;
		font-weight: bold;
		font-style: italic;
	}
}

.disabled-message {
	text-align: center;
}
</style>
