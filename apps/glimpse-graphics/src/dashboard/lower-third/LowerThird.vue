<template>
	<div>
		<h2>Display Scoreboard</h2>
		<n-button @click="replicants.lowerThird.scoreboard.value = !replicants.lowerThird.scoreboard.value">
			{{ replicants.lowerThird.scoreboard.value ? "Hide" : "Show" }}
		</n-button>
		<h2>Display Commentators/Interviewer and Interviewee</h2>
		<input placeholder="Left Person" style="max-width: 40%"
			   v-model="replicants.lowerThird.commentators.leftPerson.value"/>
		<input placeholder="Right Person" :style="{'max-width': '40%', 'margin-left': '20px'}"
			   v-model="replicants.lowerThird.commentators.rightPerson.value"/>
		<n-button @click="replicants.lowerThird.commentators.show.value = !replicants.lowerThird.commentators.show.value"
				  style="margin-left: 20px">
			{{ replicants.lowerThird.commentators.show.value ? "Hide" : "Show"}}
		</n-button>
	</div>
</template>

<script setup lang="ts">
import {NButton, NInput} from "naive-ui"
import { loadReplicants } from "../../browser-common/replicants";
import {ref} from "vue";

const replicants = await loadReplicants();


</script>

<style scoped>
</style>
