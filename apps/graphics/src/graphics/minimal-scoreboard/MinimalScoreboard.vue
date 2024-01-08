<template>
	<div id="container">
		{{ formattedClockTime }}
		<div class="box" id="box1">native css</div>
		<div class="box" id="box2">gsap 1</div>
		<div class="box" id="box3">gsap 2</div>
	</div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {loadReplicants} from "../../browser-common/replicants";
import gsap from "gsap";

const replicants = await loadReplicants();
const clock = replicants.scoreboard.clock;

const formattedClockTime = computed<string>(() => {
	let minutes = Math.floor(clock.time.value / 60000).toString();
	let seconds = Math.floor((clock.time.value % 60000) / 1000).toString();
	const millis = Math.floor((clock.time.value % 1000) / 100).toString();
	seconds = seconds.padStart(2, '0');
	minutes = minutes.padStart(2, '0');
	return `${minutes}:${seconds}.${millis}`;
});


setTimeout(() => {
	gsap.to("#box3", {
		duration: 0.5,
		y: 100,
		x: 100,
		rotation: 360,
		rotationY: -360,
		repeat: -1,
		yoyo: true,
		ease: "none"
	})

	const t = gsap.timeline({repeat: -1, yoyo: true})
	t.to("#box2", {
		// ease: "none",
		// rotate: 0,
		// y: 0,
		// rotateY: 0,
	})
	t.to("#box2", {
		ease: "none",
		rotate: 0,
		y: 100,
		rotateY: -360
	}, "<")
}, 1000);

</script>


<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@500;700;900&display=swap');

</style>

<style lang="scss">
body {
	text-align: center;
	align-items: center;
	font-weight: bold;
	font-family: monospace;
	width: 100vw;
	height: 100vh;
}

.box {
	width: 20vh;
	height: 20vh;
	border-radius: 50%;
	background: linear-gradient(
			90deg,
			rgba(255, 0, 0, 1) 0%,
			rgba(255, 154, 0, 1) 10%,
			rgba(208, 222, 33, 1) 20%,
			rgba(79, 220, 74, 1) 30%,
			rgba(63, 218, 216, 1) 40%,
			rgba(47, 201, 226, 1) 50%,
			rgba(28, 127, 238, 1) 60%,
			rgba(95, 21, 242, 1) 70%,
			rgba(186, 12, 248, 1) 80%,
			rgba(251, 7, 217, 1) 90%,
			rgba(255, 0, 0, 1) 100%
	);
}

#box1 {
	margin-top: 15vh;
	margin-left: 25vw;
	padding-top: 5vh;
	animation: CIRCLE 1s infinite linear;
}

@keyframes CIRCLE {
	0% {
		transform: rotate(0deg)
		translateY(100px) rotate(0deg);
	}

	100% {
		transform: rotate(360deg)
		translateY(100px) rotate(-360deg);
	}
}

#box3 {
	margin-left: 35vw;
	padding-left: 75vw;
}
</style>
