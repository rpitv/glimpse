<template>
	<div>
		<h2>Display Scoreboard</h2>
		<n-button @click="replicants.lowerThird.scoreboard.value = !replicants.lowerThird.scoreboard.value">
			{{ replicants.lowerThird.scoreboard.value ? "Hide" : "Show" }}
		</n-button>
		<h2>Display Commentators/Interviewer and Interviewee</h2>
		<n-input :on-update:value="(string) => replicants.lowerThird.commentators.leftPerson.value = string"
				 :default-value="replicants.lowerThird.commentators.leftPerson.value"
				 :style="{'max-width': '40%', 'margin-right': '20px'}" placeholder="Left Person"/>
		<n-input :on-update:value="(string) => replicants.lowerThird.commentators.rightPerson.value = string"
				 :default-value="replicants.lowerThird.commentators.rightPerson.value" style="max-width: 40%"
				 placeholder="Right Person"/>
		<n-button @click="replicants.lowerThird.commentators.show.value = !replicants.lowerThird.commentators.show.value"
				  style="margin-left: 20px">
			{{ replicants.lowerThird.commentators.show.value ? "Hide" : "Show" }}
		</n-button>
		<h2>Display Locator</h2>
		<n-button @click="replicants.lowerThird.locator.value = !replicants.lowerThird.locator.value">
			{{ replicants.lowerThird.locator.value ? "Hide" : "Show" }}
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
