<template>
	<div :class="replicants.lowerThird.locator.show.value || preview ? 'show' : 'hide'">
		<ESPNLocator v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
		<RPITVLocator v-if="rpiTVStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../browser-common/replicants";
import { espnStyles, rpiTVStyles} from "../util";
import ESPNLocator from "../styles/espn/lower-third/Locator.vue";
import RPITVLocator from "../styles/rpitv-lower-thirds/Locator.vue";

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
