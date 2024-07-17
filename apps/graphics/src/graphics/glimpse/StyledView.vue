<template>
	<div>
		<SlideshowView />
		<ImageView />
		<ScoreboardView />
	  <CopyrightView />
		<CommentatorsView />
		<div v-if="replicants.gameSettings.style.value === 'espn'">
			<ESPNProduced />
			<ESPNBanner />
		</div>
		<LocatorView />
		<LowerThirdScoreboardView />
	  <BugView />
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import {watch} from "vue";
import SlideshowView from "./SlideshowView.vue";
import ImageView from "./ImageView.vue";
import ESPNProduced from "./styles/espn/lower-third/Produced.vue";
import ESPNBanner from "./styles/espn/Banner.vue";
import BugView from "./BugView.vue";
import CommentatorsView from "./CommentatorsView.vue";
import CopyrightView from "./CopyrightView.vue";
import LocatorView from "./LocatorView.vue";
import LowerThirdScoreboardView from "./LowerThirdScoreboardView.vue";
import ScoreboardView from "./ScoreboardView.vue";


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
