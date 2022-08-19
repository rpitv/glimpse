<template>
	<div :class="'team-' + side">
		<div class="header">
			<img v-if="side === 'right' || side === 'center'" :src="teamLogoRep" alt="Team Logo" class="header-logo right" />
			<h1>{{ teamNameRep }}</h1>
			<img v-if="side === 'left'" :src="teamLogoRep" alt="Team Logo" class="header-logo left" />
		</div>

		<div class="score">{{teamScoreRep}}</div>

		<n-input-group class="score-set-controls">
			<n-button v-if="side === 'right'" @click="teamScoreRep = setScoreInput">Set Score</n-button>
			<n-input-number v-model:value="setScoreInput" @keydown="setScoreInputKeypressed"/>
			<n-button v-if="side === 'left' || side === 'center'" @click="teamScoreRep = setScoreInput">Set Score</n-button>
		</n-input-group>

		<div class="increment-buttons">
			<n-button class="increment-btn" type="info" @click="teamScoreRep += 1">
				+1
			</n-button>
			<n-button class="increment-btn" type="info" @click="teamScoreRep += 2">
				+2
			</n-button>
			<n-button class="increment-btn" type="info" @click="teamScoreRep += 3">
				+3
			</n-button>
			<n-button class="increment-btn" type="info" @click="teamScoreRep += 6">
				+6
			</n-button>
		</div>
	</div>
</template>

<script setup lang="ts">

import {defineProps, PropType, ref} from "vue";
import {replicant} from "../../browser-common/replicant";
import {NInputGroup, NInputNumber, NButton} from "naive-ui";

const props = defineProps({
	teamId: {
		type: Number,
		required: true
	},
	side: {
		type: String as PropType<"left" | "right" | "center">,
		default: "center"
	}
})

const setScoreInput = ref<number>(0);

const teamScoreRep = await replicant<number>("score", `glimpse-graphics.scoreboard.team${props.teamId}`, 0);
const teamNameRep = await replicant<string>("name", `glimpse-graphics.game-settings.team${props.teamId}`);
const teamPrimaryColorRep = await replicant<string>("primaryColor", `glimpse-graphics.game-settings.team${props.teamId}`);
const teamSecondaryColorRep = await replicant<string>("secondaryColor", `glimpse-graphics.game-settings.team${props.teamId}`);
const teamLogoRep = await replicant<string>("logoUrl", `glimpse-graphics.game-settings.team${props.teamId}`);

function setScoreInputKeypressed(event: KeyboardEvent) {
	if (event.key === "Enter") {
		teamScoreRep.value = setScoreInput.value;
	}
}
</script>

<style scoped lang="scss">
	.team-left {
		text-align: right;
		* {
			justify-content: right;
		}
	}
	.team-center {
		text-align: center;
		* {
			justify-content: center;
		}
	}

	.header {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.header-logo {
		max-width: 32px;
	}
	.header-logo.right {
		margin-right: 16px;
	}
	.header-logo.left {
		margin-left: 16px;
	}

	.score {
		font-size: 4em;
	}

	.score-set-controls {
		text-align: initial;
	}

	.increment-buttons {
		margin-top: 0.5em;
	}
	.increment-btn {
		margin-right: 0.5em;
	}

</style>
