<template>
	<img class="locator" :src="Locator">
	<div :style="leftTeamPrimaryColor">
		<img :style="leftTeamLogo" :src="replicantLocator.leftTeam.logo.value" :alt="replicants.teams[0].name.value">
		<div :style="leftTeamName">{{ replicantLocator.leftTeam.name.value || replicants.teams[0].schoolName }}</div>
	</div>
	<div :style="rightTeamPrimaryColor">
		<img :style="rightTeamLogo" :src="replicantLocator.rightTeam.logo.value" :alt="replicants.teams[1].name.value">
		<div :style="rightTeamName">{{ replicantLocator.rightTeam.name.value || replicants.teams[1].schoolName }}</div>
	</div>
	<div :style="location">{{ replicantLocator.location.name.value || "Houston Field House" }}</div>
</template>

<script setup lang="ts">
import Locator from "../../../../assets/rpitv-modern/Locator.png"
import {loadReplicants} from "../../../../browser-common/replicants";
import {computed, type CSSProperties} from "vue";

const replicants = await loadReplicants()

// background color of the gray in use rgb(133,133,133);
const replicantLocator = replicants.lowerThird.locator;

const leftTeamPrimaryColor = computed((): CSSProperties => {return {
	alignItems: "center",
	backgroundColor: replicantLocator.leftTeam.primaryColor.value || replicants.teams[0].primaryColor.value,
	bottom: "15.7vh",
	display: "flex",
	height: "17.4vh",
	flexDirection: "column",
	justifyContent: "space-between",
	left: "39.1vw",
	width: "9.2vw",
}});
const rightTeamPrimaryColor = computed((): CSSProperties => {return {
	alignItems: "center",
	backgroundColor: replicantLocator.rightTeam.primaryColor.value || replicants.teams[1].primaryColor.value,
	bottom: "15.7vh",
	display: "flex",
	height: "17.4vh",
	flexDirection: "column",
	justifyContent: "space-between",
	left: "51.7vw",
	width: "9.2vw",
}});
const leftTeamLogo = computed((): CSSProperties => {return {
	height: replicantLocator.leftTeam.logoSize.value + "%",
	maxHeight: "12.3vh",
}});
const rightTeamLogo = computed((): CSSProperties => {return {
	height: replicantLocator.rightTeam.logoSize.value + "%",
	maxHeight: "12.3vh",
}});
const leftTeamName = computed((): CSSProperties => {return {
	color: replicantLocator.leftTeam.nameColor.value || "black",
	fontSize: replicantLocator.leftTeam.nameSize.value + 1.7 + "vw",
	position: "relative",
	textAlign: "center"
}});
const rightTeamName = computed((): CSSProperties => {return {
	color: replicantLocator.rightTeam.nameColor.value || "black",
	fontSize: replicantLocator.rightTeam.nameSize.value + 1.7 + "vw",
	position: "relative",
	textAlign: "center"
}});
const location = computed((): CSSProperties => {
	return {
		alignItems: "center",
		backgroundColor: "black",
		color: replicantLocator.location.nameColor.value || "#d6001c",
		bottom: "10.7vh",
		display: "flex",
		fontSize: replicantLocator.location.nameSize.value + 2.5 + "vh",
		fontWeight: "bolder",
		justifyContent: "center",
		left: "40vw",
		width: "20.1vw",
	}
})

</script>

<style scoped>

@font-face{
	font-family: "Rubik";
	src: url('../../../../assets/rpitv-modern/Rubik.ttf');
}
div {
	position: absolute;
	font-family: 'Rubik', sans-serif;
	color: white;
}
.locator {
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
#leftTeam{
	position: absolute;
	text-align: center;
	bottom: 16.2vh;
	width: 87.3vw;
	left: 0;
	font-size: 2.4vh;
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
	bottom: 16.2vh;
	width: 112.6vw;
	left: 0;
	font-size: 2.4vh;
}

#rightLogo {
	width: 112.6vw;
	bottom: 19.8vh;
}

#rightLogo > img {
	position: relative;
}
</style>
