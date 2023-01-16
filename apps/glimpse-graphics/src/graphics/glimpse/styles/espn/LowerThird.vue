<template>
	<div :class="{show: replicants.lowerThird.scoreboard.value, hide: !replicants.lowerThird.scoreboard.value}">
		<Scoreboard />
	</div>
	<div :class="{show: replicants.lowerThird.commentators.show.value, hide: !replicants.lowerThird.commentators.show.value}">
		<Commentators />
	</div>
</template>

<script setup lang="ts">
import Scoreboard from "./lower-third/Scoreboard.vue";
import Commentators from "./lower-third/Commentators.vue";
import {loadReplicants} from "../../../../browser-common/replicants";

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
