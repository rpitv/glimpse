<template>
<div>
	<n-checkbox class="ml-10" v-model:checked="syncPenalties1">Sync penalties for home team?</n-checkbox>
	<br>
	<n-checkbox class="ml-10" v-model:checked="syncPenalties2">Sync penalties for away team?</n-checkbox>
	<n-grid :cols="2" :x-gap="10" :y-gap="10">
		<n-grid-item>
			<h2>Away Team</h2>
			<AnnouncementsSection v-model:announcements="awayMessages" />
		</n-grid-item>
		<n-grid-item>
			<h2>Home Team</h2>
			<AnnouncementsSection v-model:announcements="homeMessages" />
		</n-grid-item>
		<n-grid-item>
			<h2>Global</h2>
			<AnnouncementsSection v-model:announcements="globalMessages" />
		</n-grid-item>
	</n-grid>
</div>
</template>

<script setup lang="ts">
import {NGrid, NGridItem, NCheckbox} from "naive-ui";
import AnnouncementsSection from "./AnnouncementsSection.vue";
import {loadReplicants} from "../../browser-common/replicants";

const replicants = await loadReplicants();
const syncPenalties1 = replicants.sync.values.teams[0].penalty;
const syncPenalties2 = replicants.sync.values.teams[1].penalty;


const homeMessages = replicants.announcements.team1;
const awayMessages = replicants.announcements.team2;
const globalMessages = replicants.announcements.global;
</script>

<style scoped lang="scss">
h2 {
	margin: 5px;
}
</style>
