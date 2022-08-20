<template>
	<div class="scoreboard">
		<div class="diamond">
			<svg viewBox='0 0 100 100' preserveAspectRatio='none'>
				<path d='M0,50 L50,0 100,50 50,100 0,50z' />
			</svg>
			<div :class="'time ' + (clockTimeRep < 10000 ? 'low-time' : '')">{{ formattedClockTime }}</div>
			<div class="period">{{ formattedPeriod }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import {replicant} from "../../browser-common/replicant";
import {computed} from "vue";

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
</script>

<style scoped lang="scss">
	.diamond {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;

		width: 5em;
		height: 5em;
		text-align: center;

		svg {
			position: absolute;
			fill: rgb(35, 36, 40);
			z-index: -1;
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
