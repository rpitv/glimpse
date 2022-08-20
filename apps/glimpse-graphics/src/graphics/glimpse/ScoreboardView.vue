<template>
	<div class="scoreboard">
		<TeamView v-if="isTeamOneEnabledRep" ref="teamOneElem" :team-id="1" side="left" :background-width="requiredWidth" />
		<div class="diamond">
			<svg viewBox='0 0 100 100' preserveAspectRatio='none'>
				<path d='M0,50 L50,0 100,50 50,100 0,50z' />
			</svg>
			<div v-if="isClockEnabledRep">
				<div :class="'time ' + (clockTimeRep < 10000 ? 'low-time' : '')">{{ formattedClockTime }}</div>
				<div class="period">{{ formattedPeriod }}</div>
			</div>
		</div>
		<TeamView v-if="isTeamTwoEnabledRep" ref="teamTwoElem" :team-id="2" side="right" :background-width="requiredWidth" />
	</div>
</template>

<script setup lang="ts">

import {replicant} from "../../browser-common/replicant";
import {computed, ref} from "vue";
import TeamView from "./TeamView.vue";

const isTeamOneEnabledRep = await replicant<boolean>("teamEnabled", `glimpse-graphics.game-settings.team1`);
const isTeamTwoEnabledRep = await replicant<boolean>("teamEnabled", `glimpse-graphics.game-settings.team2`);
const isClockEnabledRep = await replicant<boolean>("enabled", `glimpse-graphics.game-settings.clock`);
const clockTimeRep = await replicant<number>(
	'clockTime',
	'glimpse-graphics.scoreboard.clock',
	1200 * 1000
);
const currentPeriodRep = await replicant<number>(
	'currentPeriod',
	'glimpse-graphics.scoreboard.clock',
	1
);

const formattedClockTime = computed<string>(() => {
	const clockTime = clockTimeRep.value;
	if (clockTime === undefined) {
		return '0:00.0';
	}

	const minutes = Math.floor(clockTimeRep.value / 60000).toString();
	let seconds = Math.floor((clockTimeRep.value % 60000) / 1000).toString();
	const millis = Math.floor((clockTimeRep.value % 1000) / 100).toString();
	if (minutes === '0') {
		return `${seconds}.${millis}`;
	} else {
		// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
		seconds = seconds.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}
})

const formattedPeriod = computed<string>(() => {
	if(currentPeriodRep.value === undefined) {
		return '1st';
	}

	// Teens for some reason all end in "th" in English.
	if(currentPeriodRep.value > 10 && currentPeriodRep.value < 20) {
		return currentPeriodRep.value + 'th';
	}

	// For all other numbers, we need to figure out the suffix.
	const lastNumberOfPeriod = currentPeriodRep.value % 10;
	if(lastNumberOfPeriod === 1) {
		return `${currentPeriodRep.value}st`;
	} else if(lastNumberOfPeriod === 2) {
		return `${currentPeriodRep.value}nd`;
	} else if(lastNumberOfPeriod === 3) {
		return `${currentPeriodRep.value}rd`;
	} else {
		return `${currentPeriodRep.value}th`;
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
		left: 5em;

		display: flex;
		align-items: center;
	}
	.diamond {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;

		width: 5em;
		height: 5em;
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
		line-height: 1.1em;

		.time {
			color: white;
			transition: color 1s, font-size 0.5s;

			&.low-time {
				color: rgb(255, 175, 175);
				font-size: 1.2em;
			}
		}
		.period {
			color: #ccc;
			font-size: 0.9em;
		}
	}
</style>
