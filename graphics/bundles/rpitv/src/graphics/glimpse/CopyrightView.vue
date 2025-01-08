<template>
	<div :class="replicants.lowerThird.showCopyright.value || preview ? 'show' : 'hide'">
		<ESPNCopyright v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
		<RPITVCopyright v-if="rpiTVStyles.indexOf(replicants.gameSettings.style.value) !== -1" />
	</div>
</template>

<script setup lang="ts">
import ESPNCopyright from "./styles/espn/lower-third/Copyright.vue";
import RPITVCopyright from "./styles/rpitv/Copyright.vue";
import { loadReplicants } from "../../browser-common/replicants"
import { espnStyles, rpiTVStyles } from "./util";
import {computed, ref} from "vue";

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
@import url("styles/transition.scss");

</style>
