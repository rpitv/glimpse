<template>
	<div class="scoreboard">
		<TeamView v-if="teamOne.enabled.value" ref="teamOneElem" :team-id="0" side="left" :background-width="requiredWidth" />
		<div class="diamond">
			<svg viewBox='0 0 100 100' preserveAspectRatio='none'>
				<path d='M0,50 L50,0 100,50 50,100 0,50z' />
			</svg>
			<div v-if="replicants.gameSettings.clock.enabled.value" class="clock-section">
				<div :class="'time ' + (clock.time.value < 10000 ? 'low-time' : '')">{{ formattedClockTime }}</div>
			</div>
			<div v-if="replicants.gameSettings.periods.enabled.value"  class="period">{{ formattedPeriod }}</div>
		</div>
		<TeamView v-if="teamTwo.enabled.value" ref="teamTwoElem" :team-id="1" side="right" :background-width="requiredWidth" />
	</div>
</template>

<script setup lang="ts">

import {computed, ref} from "vue";
import TeamView from "./TeamView.vue";
import {loadReplicants} from "../../browser-common/replicants";

const replicants = await loadReplicants();
const teamOne = replicants.teams[0];
const teamTwo = replicants.teams[1];

const clock = replicants.scoreboard.clock;
const period = replicants.scoreboard.period;

const formattedClockTime = computed<string>(() => {
	const minutes = Math.floor(clock.time.value / 60000).toString();
	let seconds = Math.floor((clock.time.value % 60000) / 1000).toString();
	const millis = Math.floor((clock.time.value % 1000) / 100).toString();
	if (minutes === '0') {
		return `${seconds}.${millis}`;
	} else {
		// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
		seconds = seconds.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}
})

const formattedPeriod = computed<string>(() => {

	if(period.value > replicants.gameSettings.periods.count.value) {
		const overtimePeriod = period.value - replicants.gameSettings.periods.count.value;
		if(overtimePeriod === 1) {
			return 'OT';
		} else {
			return `OT${overtimePeriod}`;
		}
	}

	if(period.value === undefined) {
		return '1st';
	}

	// Teens for some reason all end in "th" in English.
	if(period.value > 10 && period.value < 20) {
		return period.value + 'th';
	}

	// For all other numbers, we need to figure out the suffix.
	const lastNumberOfPeriod = period.value % 10;
	if(lastNumberOfPeriod === 1) {
		return `${period.value}st`;
	} else if(lastNumberOfPeriod === 2) {
		return `${period.value}nd`;
	} else if(lastNumberOfPeriod === 3) {
		return `${period.value}rd`;
	} else {
		return `${period.value}th`;
	}
});

// Take the required width of each individual team element, take the max of the two, and send that width for both of
//   them to use via their background-width prop.
const teamOneElem = ref<typeof TeamView| null>(null);
const teamTwoElem = ref<typeof TeamView| null>(null);
const requiredWidth = computed<number>(() => {
	return Math.max(teamOneElem.value?.requiredWidth ?? 0, teamTwoElem.value?.requiredWidth ?? 0);
});
</script>

<style scoped lang="scss">
	.scoreboard {
		position: relative;
		top: 2em;
		left: 3em;

		display: flex;
		align-items: center;
	}
	.diamond {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;

		width: 7em;
		height: 7em;
		text-align: center;
		z-index: 10;
		* {
			z-index: 10;
		}

		svg {
			position: absolute;
			fill: rgb(35, 36, 40);
			z-index: 9;
			width: 100%;
			height: 100%;
		}

		font-family: Biryani, sans-serif;
		font-weight: 700;
		line-height: 1.65em;

		.time {
			color: white;
			transition: color 1s, font-size 0.5s;
			font-size: 1.5em;

			&.low-time {
				color: rgb(255, 175, 175);
				font-size: 1.8em;
			}
		}
		.period {
			color: #ccc;
			font-size: 1.5em;
		}
	}

	.clock-section {
		margin-top: 0.8em;
	}
</style>
