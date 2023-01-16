<template>
	<div>
		<h2>Display Scoreboard</h2>
		<n-button @click="replicants.lowerThird.scoreboard.value = !replicants.lowerThird.scoreboard.value">
			{{ replicants.lowerThird.scoreboard.value ? "Hide" : "Show" }}
		</n-button>
	</div>
</template>

<script setup lang="ts">
import {NButton} from "naive-ui"
import { loadReplicants } from "../../browser-common/replicants";

const replicants = await loadReplicants();

</script>

<style scoped>

</style>
