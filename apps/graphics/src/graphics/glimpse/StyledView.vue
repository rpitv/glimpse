<template>
	<div>
		<SlideshowView />
		<ImageView />
		<LowerThirdView />
		<ScoreboardView />
	  <CopyrightView />
		<div v-if="replicants.gameSettings.style.value === 'espn'">
			<ESPNProduced />
			<ESPNBanner />
		</div>
	  <BugView />
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import SlideshowView from "./SlideshowView.vue";
import ImageView from "./ImageView.vue";

import ESPNProduced from "./styles/espn/lower-third/Produced.vue";
import ESPNScoreboardView from "./styles/espn/ScoreboardView.vue";
import ESPNLowerThird from "./styles/espn/LowerThird.vue"
import ESPNBanner from "./styles/espn/Banner.vue";
import {watch} from "vue";
import BugView from "../glimpse/BugView.vue";
import LowerThirdView from "../glimpse/LowerThirdView.vue";
import CopyrightView from "../glimpse/CopyrightView.vue";
import ScoreboardView from "../glimpse/ScoreboardView.vue";

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
