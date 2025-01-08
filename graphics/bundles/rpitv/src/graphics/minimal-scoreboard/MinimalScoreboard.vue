<template>
	<div class="container">
		{{ computedDate }}
		&emsp;|&emsp;
		{{ computedTime }}
		&emsp;|&emsp;
		{{ awayTeam.schoolName.value }}
		{{ awayTeam.score }}
		&emsp;|&emsp;
		{{ homeTeam.schoolName.value }}
		{{ homeTeam.score }}
		&emsp;|&emsp;
		Period {{ period }}
		&emsp;|&emsp;
		{{ formattedClockTime }}
		&emsp;|&emsp;
		{{ shotClock }}
	</div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {loadReplicants} from "../../browser-common/replicants";

const replicants = await loadReplicants();
const clock = replicants.scoreboard.clock;
const period = replicants.scoreboard.period;
const awayTeam = replicants.teams[1];
const homeTeam = replicants.teams[0];
const shotClock = replicants.scoreboard.playClock;


const formattedClockTime = computed<string>(() => {
	let minutes = Math.floor(clock.time.value / 60000).toString();
	let seconds = Math.floor((clock.time.value % 60000) / 1000).toString();
	const millis = Math.floor((clock.time.value % 1000) / 100).toString();
	seconds = seconds.padStart(2, '0');
	minutes = minutes.padStart(2, '0');
	return `${minutes}:${seconds}.${millis}`;
});

const date = computed<string>(() => {
	const d = new Date();
	return `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`
});

const computedDate = ref<string>(new Date().toDateString());
const computedTime = ref<string>(new Date().toLocaleTimeString());

// updates the clock values on display
setInterval(() => {
	const d = new Date();
	computedDate.value = d.toDateString();
	computedTime.value = d.toLocaleTimeString();
}, 250);


</script>


<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@500;700;900&display=swap');

.container {
	font-weight: bold;
	font-family: SansSerif, serif;
	position: absolute;
	padding-top: 0.7%;
	height: 5%;
	bottom: 0;
	width: 100%;
	background-color: black;
	color: white;
	text-align: center;
}

</style>
