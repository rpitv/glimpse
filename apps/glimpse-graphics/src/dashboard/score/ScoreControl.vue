<template>
	<div v-if="replicants.teams[0].enabled && replicants.teams[1].enabled">
		<n-grid :cols="2" x-gap="30">
			<n-grid-item>
				<TeamScoreControl :team-id="0" side="left"/>
			</n-grid-item>
			<n-grid-item>
				<TeamScoreControl :team-id="1" side="right"/>
			</n-grid-item>
		</n-grid>
		<MessageCreator class="mt-10" @add="replicants.messages.global.value = [...replicants.messages.global.value, $event]" />
		<MessageList v-model:messages="replicants.messages.global.value" />
	</div>

	<TeamScoreControl v-else-if="replicants.teams[0].enabled" side="center" :team-id="0"/>
	<TeamScoreControl v-else-if="replicants.teams[1].enabled" side="center" :team-id="1"/>
	<div v-else>
		<p class="no-teams-message">Both teams are disabled.</p>
	</div>
</template>

<script setup lang="ts">

import TeamScoreControl from "./TeamScoreControl.vue";
import {NGrid, NGridItem} from "naive-ui";
import MessageCreator from "./MessageCreator.vue";
import MessageList from "./MessageList.vue";
import {loadReplicants} from "../../browser-common/replicants";

const replicants = await loadReplicants();
</script>

<style scoped lang="scss">
.no-teams-message {
	text-align: center;
}
.mt-10 {
	margin-top: 10px;
}
</style>
