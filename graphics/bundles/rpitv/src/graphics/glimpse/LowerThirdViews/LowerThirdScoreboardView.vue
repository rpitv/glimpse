<template>
	<div :class="replicants.lowerThird.scoreboard.show.value || preview ? 'show' : 'hide'">
		<ESPNScoreboard v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
		<RPITVScoreboard v-if="rpiTVStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../browser-common/replicants";
import { espnStyles, rpiTVStyles} from "../util";
import ESPNScoreboard from "../styles/espn/lower-third/Scoreboard.vue";
import RPITVScoreboard from "../styles/rpitv-lower-thirds/Scoreboard.vue";

defineProps({
	preview: {
		type: Boolean,
		required: false,
		default: false
	}
});

const replicants = await loadReplicants();
</script>

<style scoped lang="scss">
</style>
