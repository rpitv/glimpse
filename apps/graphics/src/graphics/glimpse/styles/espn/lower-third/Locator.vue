<template>
	<img class="locator" :src="Locator">
	<div :style="leftTeamSecondaryColor"></div>
	<div :style="leftTeamPrimaryColor">
		<img :style="leftTeamLogo" :src="replicants.lowerThird.locator.leftTeam.logo.value || replicants.teams[0].logo.value">
	</div>
	<div :style="rightTeamSecondaryColor"></div>
	<div :style="rightTeamPrimaryColor">
		<img :style="rightTeamLogo" :src="replicants.lowerThird.locator.rightTeam.logo.value || replicants.teams[1].logo.value">
	</div>
	<div :style="leftTeamName">{{ replicantLocator.leftTeam.name.value || replicants.teams[0].schoolName.value }}</div>
	<div :style="rightTeamName">{{ replicantLocator.rightTeam.name.value || replicants.teams[1].schoolName.value }}</div>
	<div :style="location	">
<!--		Houston Field House - Troy, NY-->
	</div>
</template>

<script setup lang="ts">
import Locator from "../../../../../assets/espn/Locator.png"
import { loadReplicants } from "../../../../../browser-common/replicants";
import type { CSSProperties } from "vue";
import { computed } from "vue";

const replicants = await loadReplicants();
const replicantLocator = replicants.lowerThird.locator;

const leftTeamSecondaryColor = computed((): CSSProperties => {return {
	backgroundColor: replicantLocator.leftTeam.secondaryColor.value || replicants.teams[0].secondaryColor.value,
	bottom: "22.1vh",
	height: "9.6vh",
	left: "29.3vw",
	width: "2.7vw"
}});
const leftTeamPrimaryColor = computed((): CSSProperties => {return {
	alignItems: "center",
	backgroundColor: replicantLocator.leftTeam.primaryColor.value || replicants.teams[0].primaryColor.value,
	bottom: "22.1vh",
	display: "flex",
	height: "9.6vh",
	justifyContent: "center",
	left: "32.4vw",
	width: "11.8vw",
}});
const rightTeamPrimaryColor = computed((): CSSProperties => {return {
	alignItems: "center",
	backgroundColor: replicantLocator.rightTeam.primaryColor.value || replicants.teams[1].primaryColor.value,
	bottom: "22.1vh",
	display: "flex",
	height: "9.6vh",
	justifyContent: "center",
	left: "55.5vw",
	width: "11.9vw",
}});
const rightTeamSecondaryColor = computed((): CSSProperties => {return {
	backgroundColor: replicantLocator.rightTeam.secondaryColor.value || replicants.teams[0].secondaryColor.value,
	bottom: "22.1vh",
	height: "9.6vh",
	left: "67.6vw",
	width: "2.7vw",
}});
const leftTeamLogo = computed((): CSSProperties => {return {
	height: replicantLocator.leftTeam.logoSize.value + "%",
	maxHeight: "9.5vh",
	maxWidth: "11.9vw",
	position: "relative",
}});
const rightTeamLogo = computed((): CSSProperties => {return {
	height: replicantLocator.rightTeam.logoSize.value + "%",
	maxHeight: "9.5vh",
	maxWidth: "11.9vw",
	position: "relative",
}});
const leftTeamName = computed((): CSSProperties => {return {
	alignItems: "center",
	color: replicantLocator.leftTeam.nameColor.value || "black",
	display: "flex",
	flexWrap: "nowrap",
	fontSize: replicantLocator.leftTeam.nameSize.value + 3.7 + "vh",
	height: "5.55vh",
	justifyContent: "center",
	left: "30.84vw",
	top: "79.26vh",
	width: "14vw",
}});
const rightTeamName = computed((): CSSProperties => {return {
	alignItems: "center",
	color: replicantLocator.rightTeam.nameColor.value || "black",
	display: "flex",
	flexWrap: "nowrap",
	fontSize: replicantLocator.rightTeam.nameSize.value + 3.7 + "vh",
	height: "5.55vh",
	justifyContent: "center",
	left: "54.78vw",
	top: "79.26vh",
	width: "14vw",
}});
const location = computed((): CSSProperties => {
	return {
		alignItems: "center",
		color: "pink",
		bottom: "10.9vh",
		display: "flex",
		height: "3.97vh",
		fontSize: "3.6vh",
		justifyContent: "center",
		left: "34.08vw",
		width: "32.875vw",
	}
})

</script>

<style scoped>
@font-face {
	font-family: "swiss721_heavy";
	src: url('../../../../../assets/espn/Swiss721Heavy.ttf')
}
div {
	position: absolute;
	font-family: "swiss721_heavy";
}
.locator {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
}
.leftTeamName {
	color: rgba(63,63,63);
	left: 30.84vw; /* 592px / 1920px * 100 */
	top: 79.26vh; /* 856px / 1080px * 100 */
	width: 14vw; /* 270px / 1920px * 100 */
	height: 5.55vh; /* 60px / 1080px * 100 */
	word-wrap: anywhere;

	font-size: calc(1.7vw);
	display: flex;
	justify-content: center;
	align-content: center;
	flex-wrap: wrap;
}
.rightTeamName {
	color: rgba(63,63,63);
	left: 54.78vw; /* 1052px / 1920px * 100 */
	top: 79.26vh; /* 856px / 1080px * 100 */
	width: 14vw; /* 270px / 1920px * 100 */
	height: 5.5vh; /* 60px / 1080px * 100 */
	word-wrap: anywhere;

	font-size:calc(1.7vw);
	display: flex;
	justify-content: center;
	align-content: center;
	flex-wrap: wrap;
}
</style>
