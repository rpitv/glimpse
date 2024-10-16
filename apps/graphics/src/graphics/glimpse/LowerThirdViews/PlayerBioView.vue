<template>
	<div :class="replicants.lowerThird.playerBio.show.value || preview ? 'show' : 'hide'">
		<ESPNPlayerBio v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../browser-common/replicants";
import { espnStyles, rpiTVStyles} from "../util";
import ESPNPlayerBio from "../styles/espn/lower-third/PlayerBio.vue";

defineProps({
	preview: {
		type: Boolean,
		required: false,
		default: false
	}
});

const replicants = await loadReplicants();
</script>

<style scoped>

</style>
