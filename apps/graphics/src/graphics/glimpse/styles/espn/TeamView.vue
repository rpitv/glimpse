<template>
	<div class="team-section">
		<div class="logo-section">
			<img v-if="team.logo.value" :src="team.logo.value" alt="">
		</div>
		<div class="name-section">
			<p>
				{{ team.schoolName.value }}
			</p>
		</div>
		<div class="score-section">
			<p>
				{{ team.score.value }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">

import {defineProps} from "vue";
import {loadReplicants} from "../../../../browser-common/replicants";

const props = defineProps({
	teamId: {
		type: Number,
		required: true
	}
})

const replicants = await loadReplicants();
const team = replicants.teams[props.teamId];
const messages = replicants.announcements[<'team1' | 'team2'>`team${props.teamId + 1}`];

// noinspection JSUnusedGlobalSymbols -- used in vbind
const logoBgColor = team.primaryColor;
</script>

<style scoped lang="scss">

.team-section {
	display: flex;
	font-family: 'Roboto', sans-serif;
	height: calc(100% - 0.3vw);
}
.logo-section {
		display: inline-flex;
		justify-content: center;
		align-items: center;

		width: 3.5vw;
		height: 100%;

		background-color: v-bind(logoBgColor);

		img {
			height: 95%;
		}
	}

	.name-section {
		display: inline-flex;
		align-items: center;

		p {
			margin-left: 0.6vw;
		}

		width: 13.5vw;
		height: 100%;

		background-color: rgb(240,240,240);
		color: rgb(73,73,68);
		font-weight: 700;
		font-size: 1.7vw;
	}

	.score-section {
		display: inline-flex;
		justify-content: right;
		align-items: center;

		width: 4.5vw;
		height: 100%;

		p {
			margin-right: 0.2vw;
		}

		background-color: rgb(240,240,240);
		color: rgb(73,73,68);
		font-weight: 900;
		font-size: 2vw;
	}
</style>
