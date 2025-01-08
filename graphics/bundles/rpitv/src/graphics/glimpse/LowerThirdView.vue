<template>
	<div :class="{show: replicants.lowerThird.commentators.show.value, hide: !replicants.lowerThird.commentators.show.value}">
		<ESPNCommentators v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1"/>
		<RPITVCommentators v-if="rpiTVStyles.indexOf(replicants.gameSettings.style.value) !== -1"/>
	</div>
	<div :class="{show: replicants.lowerThird.locator.value, hide: !replicants.lowerThird.locator.value}">
		<ESPNLocator v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
		<RPITVLocator v-if="rpiTVStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
	</div>
	<div :class="{show: replicants.lowerThird.scoreboard.value, hide: !replicants.lowerThird.scoreboard.value}">
		<ESPNScoreboard v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
		<RPITVScoreboard v-if="rpiTVStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../browser-common/replicants";
import { espnStyles, rpiTVStyles} from "./util";
import ESPNScoreboard from "./styles/espn/lower-third/Scoreboard.vue";
import ESPNLocator from "./styles/espn/lower-third/Locator.vue";
import ESPNCommentators from "./styles/espn/lower-third/Commentators.vue";
import ESPNCopyright from "./styles/espn/lower-third/Copyright.vue";
import RPITVScoreboard from "./styles/rpitv/Scoreboard.vue";
import RPITVLocator from "./styles/rpitv/Locator.vue";
import RPITVCommentators from "./styles/rpitv/Commentators.vue";
import RPITVCopyright from "./styles/rpitv/Copyright.vue";

const replicants = await loadReplicants();
</script>

<style scoped lang="scss">
@import url("styles/transition.scss");
</style>
