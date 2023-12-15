<template>
<div>
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
import {NGrid, NGridItem} from "naive-ui";
import AnnouncementsSection from "./AnnouncementsSection.vue";
import {loadReplicants} from "../../browser-common/replicants";

const replicants = await loadReplicants();

const homeMessages = replicants.announcements.team1;
const awayMessages = replicants.announcements.team2;
const globalMessages = replicants.announcements.global;
</script>

<style scoped lang="scss">
h2 {
	margin: 5px;
}
</style>
