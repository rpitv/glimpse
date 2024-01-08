<template>
<div>
	<n-checkbox class="ml-10" v-model:checked="showPenalties"
				v-if="replicants.gameSettings.style.value === 'espn' || replicants.gameSettings.style.value === 'rpitv-style7'">
		Show Penalties
	</n-checkbox>
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
			<AnnouncementsSection v-model:announcements="globalMessages" :global-announcements="true"/>
		</n-grid-item>
		<n-grid-item v-if="(replicants.gameSettings.style.value === 'espn' || replicants.gameSettings.style.value === 'rpitv-style7') &&
		 replicants.gameSettings.periods.shootouts.value">
			<h2>Shootouts</h2>
			<Shootouts/>
		</n-grid-item>
		<n-grid-item v-if="replicants.gameSettings.style.value === 'espn'">
			<h2>Banner</h2>
			<n-checkbox size="large"
						v-model:checked="replicants.sync.values.sogs.value">
				Show SOGS (SOGS will only be shown whilst the scoreboard is up)
			</n-checkbox>
		</n-grid-item>
	</n-grid>
</div>
</template>

<script setup lang="ts">
import {NGrid, NGridItem, NCheckbox} from "naive-ui";
import AnnouncementsSection from "./AnnouncementsSection.vue";
import {loadReplicants} from "../../browser-common/replicants";
import Shootouts from "./Shootouts.vue";

const replicants = await loadReplicants();
const showPenalties = replicants.scoreboard.penalty;


const homeMessages = replicants.announcements.team1;
const awayMessages = replicants.announcements.team2;
const globalMessages = replicants.announcements.global;
</script>

<style scoped lang="scss">
h2 {
	margin: 5px;
}

</style>
