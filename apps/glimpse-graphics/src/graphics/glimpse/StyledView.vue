<template>
	<div>
		<div v-if="replicants.gameSettings.style.value === 'espn'">
			<ESPNImageView />
			<ESPNScoreboardView />
			<ESPNLowerThird />
		</div>
		<div v-else-if="replicants.gameSettings.style.value === 'rpitv-modern'">
			<TVModernImageView />
			<TVModernScoreboardView />
			<TGVModernLowerThird />
		</div>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import ESPNScoreboardView from "./styles/espn/ScoreboardView.vue";
import ESPNImageView from "./styles/espn/ImageView.vue";
import ESPNLowerThird from "./styles/espn/LowerThird.vue";

import TVModernScoreboardView from "./styles/rpitv-modern/ScoreboardView.vue";
import TVModernImageView from "./styles/rpitv-modern/ImageView.vue";
import TGVModernLowerThird from "./styles/rpitv-modern/LowerThird.vue"

const replicants = await loadReplicants();
</script>

<style scoped lang="scss">
</style>
