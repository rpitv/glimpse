<template>
	<div :class="replicants.lowerThird.scoreboard.value || preview ? 'show' : 'hide'">
		<ESPNScoreboard v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
		<RPITVScoreboard v-if="rpiTVStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../src/browser-common/replicants";
import { espnStyles, rpiTVStyles} from "../glimpse/util";
import ESPNScoreboard from "./styles/espn/lower-third/Scoreboard.vue";
import RPITVScoreboard from "./styles/rpitv/Scoreboard.vue";

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
@import url("./styles/transition.scss");
</style>
