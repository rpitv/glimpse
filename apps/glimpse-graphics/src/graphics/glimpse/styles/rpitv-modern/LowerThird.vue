<template>
	<div :class="{show: replicants.lowerThird.endGraphics.show.value, hide: !replicants.lowerThird.endGraphics.show.value}">
		<EndGraphics/>
	</div>
	<div :class="{show: replicants.lowerThird.locator.value, hide: !replicants.lowerThird.locator.value}">
		<Locator/>
	</div>
	<div :class="{show: replicants.lowerThird.scoreboard.value, hide: !replicants.lowerThird.scoreboard.value}">
		<Scoreboard/>
	</div>
	<div :class="{show: replicants.lowerThird.bug.value, hide: !replicants.lowerThird.bug.value}">
		<Bug />
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../browser-common/replicants";
import Locator from "./lower-third/Locator.vue";
import Scoreboard from "./lower-third/Scoreboard.vue";
import EndGraphics from "./lower-third/EndGraphics.vue";
import Bug from "./lower-third/Bug.vue";

const replicants = await loadReplicants();
</script>

<style scoped>
.hide {
	opacity: 0;
	transition: 1s;
}

.show {
	opacity: 1;
	transition: 1s;
}
</style>
