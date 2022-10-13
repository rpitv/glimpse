<template>
	<div :class="'scoreboard ' + (replicants.scoreboard.visible.value ? '' : 'hidden')">
		<div class="team1-section">
			<TeamView class="bordered" v-if="teamTwo.enabled.value" :team-id="1" />

			<p v-if="replicants.messages.team1.value.length > 0" class="announcement-section team1">
				{{computedMessage(replicants.messages.team1.value[0]).value}}
			</p>
		</div>

		<div class="team2-section">
			<TeamView class="bordered no-left-border" v-if="teamOne.enabled.value" :team-id="0" />

			<p v-if="replicants.messages.team2.value.length > 0" class="announcement-section team2">
				{{computedMessage(replicants.messages.team2.value[0]).value}}
			</p>
		</div>

		<div class="bordered no-left-border time-section">
			<p v-if="replicants.gameSettings.periods.enabled.value"  class="period-section">
				{{ formattedPeriod }}
			</p>
			<hr>
			<p v-if="replicants.gameSettings.clock.enabled.value" class="clock-section">
				{{ formattedClockTime }}
			</p>
			<p v-if="replicants.messages.global.value.length > 0" class="announcement-section global">
				{{computedMessage(replicants.messages.global.value[0]).value}}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">

import {computed} from "vue";
import TeamView from "./TeamView.vue";
import {loadReplicants} from "../../browser-common/replicants";
import {DisplayableMessage} from "../../common/DisplayableMessage";

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

/*
Used to calculate whether white or black text should appear on announcements
Source: https://stackoverflow.com/a/41491220/4698546
 */
function pickTextColorBasedOnBgColorSimple(bgColor: string, lightColor: string, darkColor: string) {
	const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
	const r = parseInt(color.substring(0, 2), 16); // hexToR
	const g = parseInt(color.substring(2, 4), 16); // hexToG
	const b = parseInt(color.substring(4, 6), 16); // hexToB
	return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
		darkColor : lightColor;
}

const team1Color = replicants.teams[0].primaryColor;
const team2Color = replicants.teams[1].primaryColor;
const team1TextColor = computed(() => pickTextColorBasedOnBgColorSimple(team1Color.value, '#ffffff', '#000000'))
const team2TextColor = computed(() => pickTextColorBasedOnBgColorSimple(team2Color.value, '#ffffff', '#000000'))


function computedMessage(message: DisplayableMessage) {
	return computed(() => {
		if(!message.timer || !message.timer.visible) {
			return message.message;
		} else {
			const timeRemaining = message.timer.length - (message.timer.startedAt - replicants.scoreboard.clock.time.value);

			const minutes = Math.max(0, Math.floor(timeRemaining / 60000)).toString();
			// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
			let seconds = Math.max(0, Math.floor((timeRemaining % 60000) / 1000)).toString().padStart(2, '0');

			if(minutes === '0') {
				return message.message + ' :' + seconds
			} else {
				return message.message + ' ' + minutes + ':' + seconds
			}
		}
	})
}
</script>

<style scoped lang="scss">
	.hidden {
		opacity: 0;
	}

	.bordered {
		border: rgb(157,154,136) 0.15vw solid;

		&.no-left-border {
			border-left: none;
		}
	}

	.scoreboard {
		display: flex;
		justify-content: center;

		position: relative;
		top: 5vh;

		max-height: 4.2vh;

		transition: opacity 1s;
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
			border-right: rgb(157,154,136) 0.075vw solid;
		}

		.period-section, .clock-section {
			text-align: center;
		}

		.period-section {
			font-size: 1.4vw;
			width: 4.1vw;
		}
		.clock-section {
			font-size: 1.4vw;
			width: 5.9vw;
		}
	}

	.announcement-section {
		position: absolute;
		top: 2.5vh;
		border: rgb(157,154,136) 0.15vw solid;
		font-family: 'Roboto', sans-serif;
		font-size: 1.4vw;

		&.global {
			text-align: center;
			background-color: rgb(241,229,76);
			color: rgb(99,87,24);
			width: calc(10.1vw);
			transform: translateX(-0.15vw);
		}

		&.team1 {
			text-align: left;
			padding-left: 1em;
			background-color: v-bind(team1Color);
			color: v-bind(team1TextColor);
			width: calc(21.5vw - 1em);
		}

		&.team2 {
			text-align: left;
			padding-left: 1em;
			background-color: v-bind(team2Color);
			color: v-bind(team2TextColor);
			width: calc(21.5vw - 1em);
			transform: translateX(-0.075vw);
		}
	}
</style>
