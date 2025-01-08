<template>
	<div :class="replicants.scoreboard.visible.value ? 'show' : 'hide'">
		<ESPNScoreboard v-if="replicants.gameSettings.style.value === 'espn'" />
		<RPITV v-if="replicants.gameSettings.style.value === 'rpitv'" />
		<RPITVFootball v-if="replicants.gameSettings.style.value === 'football'" />
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import ESPNScoreboard from "./styles/espn/ScoreboardView.vue";
import RPITV from "./styles/rpitv/ScoreboardView.vue";
import RPITVFootball from "./styles/football/ScoreboardView.vue";

const replicants = await loadReplicants();

</script>

<style scoped lang="scss">

</style>
