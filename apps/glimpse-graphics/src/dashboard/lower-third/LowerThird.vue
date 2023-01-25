<template>
	<div>
		<n-input :on-update-value="(string) => replicants.lowerThird.school1Logo.value = string"
				 :default-value="replicants.lowerThird.school1Logo.value"
				 :style="{'max-width': '40%', 'margin-right': '20px'}" placeholder="URL for Home/Left team's logo"/>
		<n-input :on-update-value="(string) => replicants.lowerThird.school2Logo.value = string"
				 :default-value="replicants.lowerThird.school2Logo.value"
				 :style="{'max-width': '40%', 'margin-right': '20px'}" placeholder="URL for Away/Right logo"/>
		<h2>Display Scoreboard</h2>
		<n-button @click="replicants.lowerThird.scoreboard.value = !replicants.lowerThird.scoreboard.value"
				  :type="replicants.lowerThird.scoreboard.value ? 'error' : 'success'">
			{{ replicants.lowerThird.scoreboard.value ? "Hide" : "Show" }}
		</n-button>
		<div v-if="replicants.gameSettings.style.value === 'espn'">
			<h2>Display Commentators/Interviewer and Interviewee</h2>
			<n-input :on-update:value="(string) => replicants.lowerThird.commentators.leftPerson.value = string"
					:default-value="replicants.lowerThird.commentators.leftPerson.value"
					:style="{'max-width': '40%', 'margin-right': '20px'}" placeholder="Left Person"/>
			<n-input :on-update:value="(string) => replicants.lowerThird.commentators.rightPerson.value = string"
					:default-value="replicants.lowerThird.commentators.rightPerson.value" style="max-width: 40%"
					placeholder="Right Person"/>
			<n-button @click="replicants.lowerThird.commentators.show.value = !replicants.lowerThird.commentators.show.value"
					style="margin-left: 20px"
					:type="replicants.lowerThird.commentators.show.value ? 'error' : 'success'">
				{{ replicants.lowerThird.commentators.show.value ? "Hide" : "Show" }}
			</n-button>
		</div>
		<h2>Display Locator</h2>
		<n-button @click="replicants.lowerThird.locator.value = !replicants.lowerThird.locator.value"
				  :type="replicants.lowerThird.locator.value ? 'error' : 'success'">
			{{ replicants.lowerThird.locator.value ? "Hide" : "Show" }}
		</n-button>

		<h2>FOR TESTING PURPOSES</h2>
		<div>SOG TEAM 1: {{ replicants.teams[0].shots }}</div>
		<div>SOG TEAM 2: {{ replicants.teams[1].shots }}</div>
	</div>
</template>0

<script setup lang="ts">
import {NButton, NInput} from "naive-ui"
import { loadReplicants } from "../../browser-common/replicants";

const replicants = await loadReplicants();


</script>

<style scoped>
</style>
