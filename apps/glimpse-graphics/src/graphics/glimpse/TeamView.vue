<template>
	<div :class="'team team-' + side" :data-message-count="messages.length" :style="backgroundGradient">
		<div class="score-section" :style="'width: ' + backgroundWidth + 'px'">
			<div class="score-section-text" ref="scoreSectionTextElem">
				<div class="team-score" v-if="side === 'right'" ref="teamScoreElem">
					{{ team.score.value }}
				</div>
				<div class="team-abbr" :style="'width:' + teamAbbrWidth">
					{{ team.abbreviation.value }}
				</div>
				<div class="team-score" v-if="side === 'left'" ref="teamScoreElem">
					{{ team.score.value }}
				</div>
			</div>
		</div>
		<div v-for="msg in messages" :class="'message message-' + msg.type">
			{{ computedMessage(msg).value }}
		</div>
	</div>
</template>

<script setup lang="ts">

import {computed, defineProps, nextTick, PropType, ref, watch} from "vue";
import {loadReplicants} from "../../browser-common/replicants";
import {DisplayableMessage} from "../../common/DisplayableMessage";

const props = defineProps({
	teamId: {
		type: Number,
		required: true
	},
	side: {
		type: String as PropType<"left" | "right">,
		required: true
	},
	// We take in a background width so the parent can confirm both sides have the same width. Similarly,
	//  we output the required width so the parent can compute the necessary width.
	backgroundWidth: {
		type: Number,
		default: 200
	}
})

const replicants = await loadReplicants();
const team = replicants.teams[props.teamId];
const messages = replicants.messages[<'team1' | 'team2'>`team${props.teamId + 1}`];

const backgroundGradient = computed(() => {
	const deg = props.side === "left" ? "-20deg" : "20deg";
	return 'background-image: linear-gradient(' + deg + ', ' + team.primaryColor.value + ',' + team.secondaryColor.value + ');';
})

const scoreSectionTextElem = ref<HTMLElement | null>(null);
const requiredWidth = ref<number>(0);
const teamScoreElem = ref<HTMLElement | null>(null);
const teamAbbrWidth = ref<string>("initial");

// The required width is the width required to fit all the text nicely in the score element. This varies depending on
//   the size of the team name and the size of the score. We compute this and then the parent can take it, compare it with
//   the other side (if it exists), and then feed back to us the size we need to be in order for both sides to have the
//   same width.
watch(() => [team.abbreviation.value, team.score.value, scoreSectionTextElem.value], () => {
	// Clear the team abbreviation width so we can get an accurate measurement of maximum _required_ width.
	const tmp = teamAbbrWidth.value;
	teamAbbrWidth.value = 'initial';

	nextTick(() => {
		requiredWidth.value = scoreSectionTextElem.value?.offsetWidth ?? 0;
		// Restore the abbreviation width.
		teamAbbrWidth.value = tmp;
	})
})

// Calculate the width of the team abbreviation area so that it can be centered in the available space.
watch(() => [team.score.value, props.backgroundWidth], () => {
	nextTick(() => {
		teamAbbrWidth.value = `calc(${props.backgroundWidth}px - 1em - ${teamScoreElem.value?.offsetWidth ?? 0}px)`;
	})
})

defineExpose({requiredWidth});

function computedMessage(message: DisplayableMessage) {
	return computed(() => {
		if(!message.timer || !message.timer.visible) {
			return message.message;
		} else {
			const timeRemaining = message.timer.length - (message.timer.startedAt - replicants.scoreboard.clock.time.value);

			const minutes = Math.floor(timeRemaining / 60000).toString();
			// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
			let seconds = Math.floor((timeRemaining % 60000) / 1000).toString().padStart(2, '0');

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
.score-section {
	height: 100%;
}

.team {
	position: relative;
	height: 3em;

	border-radius: 0.5em;

	/* If this team has a message displayed, then we want to disable rounded corners along the bottom of the team */
	&:not([data-message-count="0"]) {
		border-radius: 0.5em 0.5em 0 0;
	}

	&.team-right {
		right: 2em;

		.score-section {
			margin-left: 2.2em;
			padding-right: 0.5em;
		}
	}

	&.team-left {
		left: 2em;

		.score-section {
			margin-right: 2.2em;
			padding-left: 0.5em;
			text-align: right;
		}
	}
}

.score-section-text {
	display: inline-block;
	white-space: nowrap;
}

.team-abbr, .team-score {
	display: inline;

	font-family: Biryani, sans-serif;
	color: white;
}

.team-abbr {
	display: inline-block;
	transform: translateY(-0.1em);

	margin: 0 0.5em;

	text-align: center;
	font-size: 1.5em;
	font-weight: 600;
}

.team-score {
	height: 100%;
	font-size: 2em;
	font-weight: 900;
}

.team-right .message {
	position: relative;
	left: -17%;
}

.message {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 117%;
	padding-top: 0.25em;
	font-family: Biryani, sans-serif;
	font-weight: 700;

	&.message-info {
		background-image: linear-gradient(to bottom, #7f7f7f, #676767);
		color: white;
	}

	&.message-status {
		background-image: linear-gradient(to bottom, #eccb5e, #bda24a);
	}
}

</style>
