<template>
	<div :class="'team team-' + side" :style="backgroundGradient">
		<div class="score-section" :style="'width: ' + backgroundWidth + 'px'">
			<div class="score-section-text" ref="scoreSectionTextElem">
				<div class="team-score" v-if="side === 'right'" ref="teamScoreElem">
					{{ teamScoreRep }}
				</div>
				<div class="team-abbr" :style="'width:' + teamAbbrWidth">
					{{ teamAbbrRep }}
				</div>
				<div class="team-score" v-if="side === 'left'" ref="teamScoreElem">
					{{ teamScoreRep }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import {replicant} from "../../browser-common/replicant";
import {computed, defineProps, nextTick, PropType, ref, watch} from "vue";
import {NGrid, NGridItem} from "naive-ui";

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

const teamScoreRep = await replicant<number>("score", `glimpse-graphics.scoreboard.team${props.teamId}`, 0);
const teamAbbrRep = await replicant<string>("abbr", `glimpse-graphics.game-settings.team${props.teamId}`);
const teamPrimaryColorRep = await replicant<string>("primaryColor", `glimpse-graphics.game-settings.team${props.teamId}`);
const teamSecondaryColorRep = await replicant<string>("secondaryColor", `glimpse-graphics.game-settings.team${props.teamId}`);
const teamLogoRep = await replicant<string>("logoUrl", `glimpse-graphics.game-settings.team${props.teamId}`);

const backgroundGradient = computed(() => {
	const deg = props.side === "left" ? "-20deg" : "20deg";
	return 'background-image: linear-gradient(' + deg + ', ' + teamPrimaryColorRep.value + ',' + teamSecondaryColorRep.value + ');';
})

const scoreSectionTextElem = ref<HTMLElement|null>(null);
const requiredWidth = ref<number>(0);
const teamScoreElem = ref<HTMLElement|null>(null);
const teamAbbrWidth = ref<string>("initial");

// The required width is the width required to fit all the text nicely in the score element. This varies depending on
//   the size of the team name and the size of the score. We compute this and then the parent can take it, compare it with
//   the other side (if it exists), and then feed back to us the size we need to be in order for both sides to have the
//   same width.
watch(() => [teamAbbrRep.value, teamScoreRep.value, scoreSectionTextElem.value], () => {
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
watch(() => [teamScoreRep.value, props.backgroundWidth], () => {
	nextTick(() => {
		teamAbbrWidth.value = `calc(${props.backgroundWidth}px - 1em - ${teamScoreElem.value?.offsetWidth ?? 0}px)`;
	})
})

defineExpose({ requiredWidth });
</script>

<style scoped lang="scss">
	.team {
		position: relative;
		height: 3em;

		border-radius: 0.5em;

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

</style>
