<template>
	<div>
		<n-grid :cols="2" :x-gap="10">
			<n-grid-item>
				<div>
					<h1>Away</h1>
					<MessageList v-model:announcements="awayMessages" />
					<MessageCreator @add="msg => awayMessages = [...awayMessages, msg]" />
				</div>
			</n-grid-item>
			<n-grid-item>
				<div>
					<h1>Home</h1>
					<MessageList v-model:announcements="homeMessages" />
					<MessageCreator @add="msg => homeMessages = [...homeMessages, msg]" />
				</div>
			</n-grid-item>
		</n-grid>
		<div>
			<h1>Global</h1>
			<MessageList v-model:announcements="globalMessages" />
			<MessageCreator @add="msg => globalMessages = [...globalMessages, msg]" />
		</div>
	</div>
</template>

<script setup lang="ts">
import {NGrid, NGridItem} from "naive-ui";
import MessageCreator from "./MessageCreator.vue";
import MessageList from "./MessageList.vue";
import {loadReplicants} from "../../browser-common/replicants";

const replicants = await loadReplicants();

const homeMessages = replicants.announcements.team1;
const awayMessages = replicants.announcements.team2;
const globalMessages = replicants.announcements.global;
</script>

<style scoped lang="scss">

</style>
