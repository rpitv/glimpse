<template>
	<div id="container">
		<span id="scoreboard_time">{{ formattedClockTime }}</span>
		<br><br><br>
		<span id="real_date">{{ computedDate }}</span>
		<br>
		<span id="real_time">{{ computedTime }}</span>
		<br>
		<span id="timezone">{{ computedTimezone }}</span>
	</div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {loadReplicants} from "../../browser-common/replicants";

const replicants = await loadReplicants();
const clock = replicants.scoreboard.clock;
const computedDate = ref<string>(new Date().toDateString());
const computedTime = ref<string>(new Date().toLocaleTimeString());
const computedTimezone = ref<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

const formattedClockTime = computed<string>(() => {
	let minutes = Math.floor(clock.time.value / 60000).toString();
	let seconds = Math.floor((clock.time.value % 60000) / 1000).toString();
	const millis = Math.floor((clock.time.value % 1000) / 100).toString();
	seconds = seconds.padStart(2, '0');
	minutes = minutes.padStart(2, '0');
	return `${minutes}:${seconds}.${millis}`;
});

// updates the clock values on display
setInterval(() => {
	const d = new Date();
	computedDate.value = d.toDateString();
	computedTime.value = d.toLocaleTimeString();
}, 250);

onMounted(() => {
	// detects for a click on the page to toggle fullscreen on the page
	document.body.addEventListener("click", () => {
		// Source: https://stackoverflow.com/a/61491345
		const container = document.getElementById("container");
		if (document.fullscreenElement) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if ((<any>document).mozCancelFullScreen) {
				(<any>document).mozCancelFullScreen();
			} else if ((<any>document).webkitCancelFullScreen) {
				(<any>document).webkitCancelFullScreen();
			} else if ((<any>document).msExitFullscreen) {
				(<any>document).msExitFullscreen();
			}
		} else {
			if (!(<any>document).mozFullScreen && !(<any>document).webkitFullScreen) {
				if ((<any>container).requestFullscreen) {
					(<any>container).requestFullscreen();
				} else if ((<any>container).mozRequestFullScreen) {
					(<any>container).mozRequestFullScreen();
				} else if ((<any>container).webkitRequestFullScreen) {
					(<any>container).webkitRequestFullScreen();
				} else if ((<any>container).msRequestFullscreen) {
					(<any>container).msRequestFullscreen();
				}
			}
		}
	});
})
</script>


<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@500;700;900&display=swap');

</style>

<style lang="scss">
body {
	background-color: black;
	color: white;
	text-align: center;
	align-items: center;
	font-weight: bold;
	font-family: monospace;
	width: 100vw;
	height: 100vh;
}

#scoreboard_time {
	font-size: 21vw;
}

#real_date, #real_time {
	font-size: 6vw;
}

#timezone {
	font-size: 3vw;
}
</style>
