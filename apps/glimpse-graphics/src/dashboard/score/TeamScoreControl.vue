<template>
	<div :class="'team-' + side">
		<div class="header">
			<img v-if="side === 'right' || side === 'center'" :src="team.logo.value" alt="Team Logo" class="header-logo right" />
			<h1>{{ team.name.value }}</h1>
			<img v-if="side === 'left'" :src="team.logo.value" alt="Team Logo" class="header-logo left" />
		</div>

		<div class="score">{{team.score.value}}</div>

		<n-input-group class="score-set-controls">
			<n-button v-if="side === 'right'" @click="team.score.value = setScoreInput">Set Score</n-button>
			<n-input-number v-model:value="setScoreInput" @keydown="setScoreInputKeypressed"/>
			<n-button v-if="side === 'left' || side === 'center'" @click="team.score.value = setScoreInput">Set Score</n-button>
		</n-input-group>

		<div class="increment-buttons">
			<n-button class="increment-btn" type="info" @click="team.score.value += 1">
				+1
			</n-button>
			<n-button class="increment-btn" type="info" @click="team.score.value += 2">
				+2
			</n-button>
			<n-button class="increment-btn" type="info" @click="team.score.value += 3">
				+3
			</n-button>
			<n-button class="increment-btn" type="info" @click="team.score.value += 6">
				+6
			</n-button>
		</div>

		<MessageCreator class="mt-10" @add="addMessage" />
		<MessageList v-model:messages="messages" />
	</div>
</template>

<script setup lang="ts">

import {defineProps, PropType, ref} from "vue";
import {NInputGroup, NInputNumber, NButton} from "naive-ui";
import MessageCreator from "./MessageCreator.vue";
import {loadReplicants} from "../../browser-common/replicants";
import {DisplayableMessage} from "../../common/DisplayableMessage";
import MessageList from "./MessageList.vue";

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
const replicants = await loadReplicants();

const team = replicants.teams[props.teamId];
const messages = replicants.messages[<'team1'|'team2'>('team' + (props.teamId + 1))];

function addMessage(message: DisplayableMessage) {
	// FIXME non-reactive if you just push to the array. Vue 3 should handle this automatically...
	messages.value = [...messages.value, message];
}

function setScoreInputKeypressed(event: KeyboardEvent) {
	if (event.key === "Enter") {
		team.score.value = setScoreInput.value;
	}
}
</script>

<style scoped lang="scss">
	.mt-10 {
		margin-top: 10px
	}

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
