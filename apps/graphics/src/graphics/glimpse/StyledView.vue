<template>
	<div>
		<SlideshowView />
		<ImageView />
		<BugView />
		<LowerThirdView />
		<CopyrightView />
		<ScoreboardView />
		<div v-if="replicants.gameSettings.style.value === 'espn'">
			<ESPNBanner />
		</div>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import SlideshowView from "./SlideshowView.vue";
import ImageView from "./ImageView.vue";
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
