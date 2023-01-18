<template>
	<div :class="{show: replicants.lowerThird.locator.value, hide: !replicants.lowerThird.locator.value}">
		<Locator/>
	</div>
	<div :class="{show: replicants.lowerThird.scoreboard.value, hide: !replicants.lowerThird.scoreboard.value}">
		<Scoreboard/>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../browser-common/replicants";
import Locator from "./lower-third/Locator.vue"
import Scoreboard from "./lower-third/Scoreboard.vue"

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
