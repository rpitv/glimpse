<template>
	<div :class="{show: replicants.lowerThird.bug.value, hide: !replicants.lowerThird.bug.value}">
		<ESPNBug v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
		<RPITVBug v-if="rpiTVStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
	</div>
</template>

<script setup lang="ts">
import ESPNBug from "./styles/espn/Bug.vue";
import RPITVBug from "./styles/rpitv/Bug.vue";
import { espnStyles, rpiTVStyles} from "../glimpse/util";
import { loadReplicants } from "../../../src/browser-common/replicants";

const replicants = await loadReplicants();

</script>

<style scoped lang="scss">
@import url("./styles/transition.scss");
</style>
