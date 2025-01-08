<template>
	<div :class="replicants.lowerThird.bug.show.value || preview ? 'show' : 'hide'">
		<ESPNBug v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
		<RPITVBug v-if="rpiTVStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
	</div>
</template>

<script setup lang="ts">
import ESPNBug from "../styles/espn/Bug.vue";
import RPITVBug from "../styles/rpitv-lower-thirds/Bug.vue";
import { espnStyles, rpiTVStyles} from "../util";
import { loadReplicants } from "../../../browser-common/replicants";

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
</style>
