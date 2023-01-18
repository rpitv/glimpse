<template>
	<img :src="Scoreboard">
	<div id="leftFill" :style="{background: replicants.teams[0].primaryColor.value}"></div>
	<div id="rightFill" :style="{background: replicants.teams[1].primaryColor.value}"></div>
	<div class="logo" id="leftLogo">
		<img :src="replicants.lowerThird.school1Logo.value" :alt="replicants.teams[0].name.value">
	</div>
	<div class="logo" id="rightLogo" :alt="replicants.teams[1].name.value">
		<img :src="replicants.lowerThird.school2Logo.value">
	</div>
	<div id="leftScore"></div>
	<div id="rightScore"></div>
	<div id="periodText"></div>
</template>

<script setup lang="ts">
import Scoreboard from "../../../../../assets/rpitv-modern/Scoreboard.png"
import {loadReplicants} from "../../../../../browser-common/replicants";

const replicants = await loadReplicants()
</script>

<style scoped>
img {
	position: absolute;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
}

#leftFill {
	position: absolute;
	left: 29vw;
	bottom: 16.6vh;
	width: 9.2vw;
	height: 17.4vh;
}

#rightFill {
	position: absolute;
	left: 61.8vw;
	bottom: 16.6vh;
	width: 9.2vw;
	height: 17.4vh;
}

.logo {
	position: absolute;
	justify-content: center;
	display: flex;
	left: 0;
}

.logo > img {
	width: auto;
	height: auto;
	max-width: 9vw;
	max-height: 13.2vh;
}

#leftLogo {
	width: 67.1vw;
	bottom: 20.2vh;
}

#leftLogo > img {
	position: relative;
}

#rightLogo {
	width: 132.8vw;
	bottom: 20.2vh;
}

#rightLogo > img {
	position: relative;
}
</style>
