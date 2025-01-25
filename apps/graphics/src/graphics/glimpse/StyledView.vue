<template>
	<div>
		<ImageView id="images"/>
		<ScoreboardView id="scorebug"/>
		<CommentatorsView id="commentators"/>
		<CreditsView id="credits"/>
		<div v-if="replicants.gameSettings.style.value === 'espn'">
			<ESPNProduced id="espn-produced"/>
			<ESPNBanner id="espn-banner"/>
            <ESPNTombstone id="espn-tombstone"/>
		</div>
    <LocatorView id="locator"/>
		<LowerThirdScoreboardView id="break-scoreboard"/>
		<PlayerBioView id="PlayerBio"/>
    <CopyrightView id="copyright"/>
		<BugView />
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import {watch} from "vue";
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
import ESPNTombstone from "./styles/espn/tomestone/Tombstone.vue";


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
