<template>
	<div class="containerLowerThird">
		<div
			:class="{show: replicants.lowerThird.endGraphics.show.value, hide: !replicants.lowerThird.endGraphics.show.value}">
			<EndGraphics/>
		</div>
		<div :class="{show: replicants.lowerThird.locator.value, hide: !replicants.lowerThird.locator.value}">
			<Locator/>
		</div>
		<div :class="{show: replicants.lowerThird.scoreboard.value, hide: !replicants.lowerThird.scoreboard.value}">
			<Scoreboard/>
		</div>
		<div :class="{show: replicants.lowerThird.commentators.show.value, hide: !replicants.lowerThird.commentators.show.value}">
			<Commentators />
		</div>
		<div :class="{show: replicants.lowerThird.bug.value, hide: !replicants.lowerThird.bug.value}">
			<Bug/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../browser-common/replicants";
import Locator from "./lower-third/Locator.vue";
import Scoreboard from "../rpitv/Scoreboard.vue";
import EndGraphics from "../rpitv/EndGraphics.vue";
import Bug from "../rpitv/Bug.vue";
import Commentators from "../rpitv/Commentators.vue";

const replicants = await loadReplicants();
</script>

<style scoped>
.containerLowerThird {
	left: 0;
	top: 0;
}

.hide {
	opacity: 0;
	transition: 1s;
}

.show {
	opacity: 1;
	transition: 1s;
}


</style>
