<template>
	<div :class="'scoreboard ' + (replicants.scoreboard.visible.value ? '' : 'hidden')">
		<TeamView class="bordered" v-if="teamOne.enabled.value" ref="teamOneElem" :team-id="0" />
		<TeamView class="bordered no-left-border" v-if="teamTwo.enabled.value" ref="teamTwoElem" :team-id="1" />
		<div class="bordered no-left-border time-section">
			<p v-if="replicants.gameSettings.periods.enabled.value"  class="period-section">
				{{ formattedPeriod }}
			</p>
			<hr>
			<p v-if="replicants.gameSettings.clock.enabled.value" class="clock-section">
				{{ formattedClockTime }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">

import {computed} from "vue";
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
</script>

<style scoped lang="scss">
	.hidden {
		opacity: 0;
	}

	.bordered {
		border: rgb(157,154,136) 2px solid;

		&.no-left-border {
			border-left: none;
		}
	}

	.scoreboard {
		display: flex;
		justify-content: center;

		position: relative;
		top: 6vh;

		max-height: 4.2vh;
	}

	.time-section {
		display: flex;
		align-items: center;
		font-family: 'Roboto', sans-serif;
		background-color: rgb(220, 220, 220);

		hr {
			height: 50%;
			transform: translateY(50%);
			border: 0;
			border-right: rgb(157,154,136) 1px solid;
		}

		.period-section, .clock-section {
			text-align: center;
		}

		.period-section {
			width: 4vw;
		}
		.clock-section {
			width: 5.8vw;
		}
	}
</style>
