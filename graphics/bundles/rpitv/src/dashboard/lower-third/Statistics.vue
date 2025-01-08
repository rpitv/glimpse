<template>
	<h1>Statistics pulled from Sidearms</h1>
	<div v-for="(team, i) of gameStats.team">
		<h2>Team: {{ team.$.name }}</h2>
		<h2>Record: {{ team.$.record}}</h2>
		<h3>Players</h3>
		<div v-for="player of team.player">
			#{{ player.$.code }}, {{ player.$.name }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import xml2js from "xml2js";
import { loadReplicants } from "../../browser-common/replicants";

const replicants = await loadReplicants();

const xml = await fetch("https://www.sidearmstats.com/rpi/whockey/1.xml")
const xmlText = await xml.text();
const gameStats = ref();


xml2js.parseString(xmlText, function(err: any, result: any) {
	gameStats.value = result.hkgame;
})

// for (const team of gameStats.value.team) {
// 	console.log(team)
// }

</script>

<style scoped lang="scss">

</style>
