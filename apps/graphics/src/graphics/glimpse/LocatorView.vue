<template>
	<div :class="replicants.lowerThird.locator.value || preview ? 'show' : 'hide'">
		<ESPNLocator v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
		<RPITVLocator v-if="rpiTVStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../src/browser-common/replicants";
import { espnStyles, rpiTVStyles} from "../glimpse/util";
import ESPNLocator from "./styles/espn/lower-third/Locator.vue";
import RPITVLocator from "./styles/rpitv/Locator.vue";

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
@import url("./styles/transition.scss");
</style>
