<template>
	<img :src="Locator">
	<div id="leftFill" :style="{background: replicants.teams[1].primaryColor.value}"></div>
	<div id="rightFill" :style="{background: replicants.teams[0].primaryColor.value}"></div>
	<div id="leftLogo" class="logo">
		<img :src="replicants.lowerThird.school2Logo.value" :alt="replicants.teams[1].name.value">
	</div>
	<div id="rightLogo" class="logo">
		<img :src="replicants.lowerThird.school1Logo.value" :alt="replicants.teams[0].name.value">
	</div>
	<div id="leftTeam">{{ replicants.teams[1].schoolName.value }}</div>
	<div id="rightTeam">{{ replicants.teams[0].schoolName.value }}</div>

	<div id="containerLocation">
		<div id="center">
			{{ replicants.lowerThird.location.value }}
		</div>
	</div>
</template>

<script setup lang="ts">
import Locator from "../../../../../assets/rpitv-modern/Locator.png"
import {loadReplicants} from "../../../../../browser-common/replicants";

const replicants = await loadReplicants()

</script>

<style scoped lang="scss">

@font-face {
	font-family: "Rubik";
	src: url('../../../../../assets/rpitv-modern/Rubik.ttf');
}

div {
	font-family: 'Rubik', sans-serif;
	color: white;
}

img {
	position: absolute;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
}

#leftFill {
	position: absolute;
	left: 39.1vw;
	bottom: 15.7vh;
	width: 9.2vw;
	height: 17.4vh;
}

#rightFill {
	position: absolute;
	left: 51.7vw;
	bottom: 15.7vh;
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
	max-height: 12.3vh;
}

#leftTeam {
	position: absolute;
	text-align: center;
	font-size: 2.2vh;

	left: 39.1vw;
	bottom: 15.7vh;
	width: 9.2vw;
	height: 4.8vh;
	word-wrap: anywhere;

	display: flex;
	justify-content: center;
	align-content: center;
	flex-wrap: wrap;
	line-height: 0.8;
}

#leftLogo {
	width: 87.3vw;
	bottom: 19.8vh;
}

#leftLogo > img {
	position: relative;
}

#rightTeam {
	position: absolute;
	text-align: center;
	font-size: 2.2vh;

	left: 51.7vw;
	bottom: 15.7vh;
	width: 9.2vw;
	height: 4.8vh;
	word-wrap: anywhere;

	display: flex;
	justify-content: center;
	align-content: center;
	flex-wrap: wrap;
	line-height: 0.8;
}

#rightLogo {
	width: 112.6vw;
	bottom: 19.8vh;
}

#rightLogo > img {
	position: relative;
}

#containerLocation {
	display: flex;
	justify-content: center;

	#center {
		font-family: "Rubik", sans-serif;
		position: absolute;
		width: 19vw;
		top: 100vh;
		text-align: center;
		font-size: 2.6vh;
		font-weight: bold;
		transform: translateY(-13.7vh);
		background-color: black;
		color: #ee3124;
	}
}
</style>
