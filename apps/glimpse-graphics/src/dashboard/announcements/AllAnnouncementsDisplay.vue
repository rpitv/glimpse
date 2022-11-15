<template>
<div>
	<n-grid :cols="2" :x-gap="10">
		<n-grid-item>
			<AnnouncementsDisplay v-model:announcements="awayMessages" />
		</n-grid-item>
		<n-grid-item>
			<AnnouncementsDisplay v-model:announcements="homeMessages" />
		</n-grid-item>
	</n-grid>
	<AnnouncementsDisplay v-model:announcements="globalMessages" />
</div>
</template>

<script setup lang="ts">
import {NGrid, NGridItem} from "naive-ui";
import AnnouncementsDisplay from "./AnnouncementsDisplay.vue";
import {loadReplicants} from "../../browser-common/replicants";

const replicants = await loadReplicants();

const homeMessages = replicants.announcements.team1;
const awayMessages = replicants.announcements.team2;
const globalMessages = replicants.announcements.global;
</script>

<style scoped lang="scss">

</style>
