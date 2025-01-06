<template>
	<v-select variant="outlined" label="Select the sport" item-title="name" item-value="value" :items="items" v-model="replicants.http.sidearms.url.value" />
	<h1>Statistics pulled from Sidearms (Data is regrabbed when the scoreboard changes state (either on or off))</h1>
	<div style="display: flex; justify-content: space-between">
		<div v-for="(team, i) of liveStats?.hkgame.team">
			<h2>Team: {{ team.name }}</h2>
			<h2>Record (Total, Conference): {{ team.record }}</h2>
			<h3>Totals: </h3>
			<ul class="ml-10">
				<li>Faceoffs Won: {{ team.totals.misc.facewon }}</li>
				<li>Faceoffs Lost: {{ team.totals.misc.facelost }}</li>
				<li>Faceoff %: {{ team.totals.misc.facepct}}</li>
<!--				<li>Goalie Saves: {{ team.totals.goalie.saves}}</li>-->
				<li>Penalty Count/Minutes: {{ team.totals.penalty.count }} / {{ team.totals.penalty.minutes }} </li>
				<li>Powerplay Opportunities: {{ team.totals.powerplay.ppopp }}</li>
				<li>Powerplay Goals: {{ team.totals.powerplay.ppg }}</li>
			</ul>
			<h3>Players</h3>
			<div v-for="player of team.player">
				#{{ player.code }}, {{ player.name }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import { loadReplicants } from "../../browser-common/replicants";
import { XMLParser } from "fast-xml-parser";
const replicants = await loadReplicants();


const items = [
	{
		name: "Men's Hockey",
		value: "https://www.sidearmstats.com/rpi/mhockey/1.xml"
	},
	{
		name: "Women's Hockey",
		value: "https://www.sidearmstats.com/rpi/whockey/1.xml"
	}
];
</script>

<style scoped lang="scss">

</style>
