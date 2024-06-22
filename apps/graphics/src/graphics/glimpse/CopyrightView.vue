<template>
	<div :class="{show: replicants.lowerThird.showCopyright.value, hide: !replicants.lowerThird.showCopyright.value}">
		<ESPNCopyright v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
		<RPITVCopyright v-if="rpiTVStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
	</div>
</template>

<script setup lang="ts">
import ESPNCopyright from "./styles/espn/lower-third/Copyright.vue";
import RPITVCopyright from "./styles/rpitv/Copyright.vue";
import { loadReplicants } from "../../../src/browser-common/replicants"
import { espnStyles, rpiTVStyles } from "../glimpse/util";

const replicants = await loadReplicants();

</script>

<style scoped lang="scss">
@import url("./styles/transition.scss");

</style>
