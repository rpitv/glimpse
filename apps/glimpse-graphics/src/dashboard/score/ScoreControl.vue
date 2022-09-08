<template>
	<div v-if="teamOneEnabledRep && teamTwoEnabledRep">
		<n-grid :cols="2" x-gap="30">
			<n-grid-item>
				<TeamScoreControl :team-id="0" side="left"/>
			</n-grid-item>
			<n-grid-item>
				<TeamScoreControl :team-id="1" side="right"/>
			</n-grid-item>
		</n-grid>
		<MessageCreator class="mt-10" />
	</div>

	<TeamScoreControl v-else-if="teamOneEnabledRep" side="center" :team-id="0"/>
	<TeamScoreControl v-else-if="teamTwoEnabledRep" side="center" :team-id="1"/>
	<div v-else>
		<p class="no-teams-message">Both teams are disabled.</p>
	</div>
</template>

<script setup lang="ts">

import TeamScoreControl from "./TeamScoreControl.vue";
import {NGrid, NGridItem} from "naive-ui";
import {replicant} from "../../browser-common/replicant";
import MessageCreator from "./MessageCreator.vue";

const teamOneEnabledRep = await replicant<boolean>("teamEnabled", `glimpse-graphics.game-settings.team1`);
const teamTwoEnabledRep = await replicant<boolean>("teamEnabled", `glimpse-graphics.game-settings.team2`);

</script>

<style scoped lang="scss">
.no-teams-message {
	text-align: center;
}
.mt-10 {
	margin-top: 10px;
}
</style>
