<template>
	<div :class="replicants.fullscreen.credits.show.value || preview ? 'show' : 'hide'">
		<ESPNCredits v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles } from "../util";
import { loadReplicants } from "../../../browser-common/replicants";
import ESPNCredits from "../styles/espn/fullscreen/Credits.vue";

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
