<template>
	<div :class="replicants.scoreboard.visible.value ? 'show' : 'hide'">
		<ESPNScoreboard v-if="replicants.gameSettings.style.value === 'espn'" />
		<RPITVStyle7 v-if="replicants.gameSettings.style.value === 'rpitv-style7'" />
		<RPITVModern v-if="replicants.gameSettings.style.value === 'rpitv-modern'" />
		<RPITVFootball v-if="replicants.gameSettings.style.value === 'football'" />
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import ESPNScoreboard from "./styles/espn/ScoreboardView.vue";
import RPITVStyle7 from "./styles/rpitv-style7/ScoreboardView.vue";
import RPITVModern from "./styles/rpitv-modern/ScoreboardView.vue";
import RPITVFootball from "./styles/football/ScoreboardView.vue";

const replicants = await loadReplicants();

</script>

<style scoped lang="scss">

</style>
