<template>
	<div>
		<SlideshowView />
		<ImageView />
		<div v-if="replicants.gameSettings.style.value === 'espn'">
			<ESPNCopyright />
			<ESPNScoreboardView />
			<ESPNLowerThird />
			<ESPNBanner />
		</div>
		<div v-else-if="replicants.gameSettings.style.value === 'rpitv-modern'">
			<TVModernCopyright />
			<TVModernScoreboardView />
			<TVModernLowerThird />
		</div>
		<div v-else-if="replicants.gameSettings.style.value === 'rpitv-style7'">
			<TVModernCopyright />
			<TVStyle7Scoreboard />
			<TVStyle7LowerThird />
		</div>
		<div v-else-if="replicants.gameSettings.style.value === 'football'">
			<TVModernCopyright />
			<FootballScoreboard />
			<FootballLowerThird />
		</div>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import SlideshowView from "./SlideshowView.vue";
import ImageView from "./ImageView.vue";

import ESPNCopyright from "./styles/espn/lower-third/Copyright.vue"
import ESPNScoreboardView from "./styles/espn/ScoreboardView.vue";
import ESPNLowerThird from "./styles/espn/LowerThird.vue";
import ESPNBanner from "./styles/espn/Banner.vue";

import TVModernCopyright from "./styles/rpitv-modern/lower-third/Copyright.vue"
import TVModernScoreboardView from "./styles/rpitv-modern/ScoreboardView.vue";
import TVModernLowerThird from "./styles/rpitv-modern/LowerThird.vue";

import TVStyle7Scoreboard from "./styles/rpitv-style7/ScoreboardView.vue";
import TVStyle7LowerThird from "./styles/rpitv-style7/LowerThird.vue";

import FootballScoreboard from "./styles/football/ScoreboardView.vue";
import FootballLowerThird from "./styles/football/LowerThird.vue";

import {watch} from "vue";

const replicants = await loadReplicants();

// from false to true then reload page
watch(replicants.gameSettings.api.forceReload, (newV, oldV) => {
	if (!oldV && newV) {
		location.reload();
	}
});
</script>

<style scoped lang="scss">
.hide {
	opacity: 0;
	transition: 1s;
}
.show {
	opacity: 1;
	transition: 1s;
}
</style>
