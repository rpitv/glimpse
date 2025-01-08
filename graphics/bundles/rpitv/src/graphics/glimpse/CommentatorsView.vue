<template>
	<div :class="replicants.lowerThird.commentators.show.value || preview ? 'show' : 'hide'">
		<ESPNCommentators v-if="espnStyles.indexOf(replicants.gameSettings.style.value) !== -1"/>
		<RPITVCommentators v-if="rpiTVStyles.indexOf(replicants.gameSettings.style.value) !== -1"/>
	</div>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../browser-common/replicants";
import { espnStyles, rpiTVStyles} from "./util";
import ESPNCommentators from "./styles/espn/lower-third/Commentators.vue";
import RPITVCommentators from "./styles/rpitv/Commentators.vue";

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
