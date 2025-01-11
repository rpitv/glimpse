<template>
	<div>
		<ImageView />
		<ScoreboardView />
		<CopyrightView />
		<CommentatorsView />
		<CreditsView />
		<div v-if="replicants.gameSettings.style.value === 'espn'">
			<ESPNProduced />
			<ESPNBanner />
		</div>
		<LocatorView />
		<LowerThirdScoreboardView />
		<PlayerBioView />
		<BugView />
	</div>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../browser-common/replicants";
import { watch } from "vue";
import ImageView from "./ImageView.vue";
import ESPNProduced from "./styles/espn/lower-third/Produced.vue";
import ESPNBanner from "./styles/espn/Banner.vue";
import BugView from "./LowerThirdViews/BugView.vue";
import CommentatorsView from "./LowerThirdViews/CommentatorsView.vue";
import CopyrightView from "./LowerThirdViews/CopyrightView.vue";
import CreditsView from "./FullscreenViews/CreditView.vue";
import LocatorView from "./LowerThirdViews/LocatorView.vue";
import LowerThirdScoreboardView from "./LowerThirdViews/LowerThirdScoreboardView.vue";
import ScoreboardView from "./ScoreboardView.vue";
import PlayerBioView from "./LowerThirdViews/PlayerBioView.vue";


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
