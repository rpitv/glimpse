<template>
	<img :src="Locator">
	<div id="leftTeamSecondaryColor" :style="{'background-color': replicants.teams[1].secondaryColor.value}"></div>
	<div id="leftTeamPrimaryColor" :style="{'background-color': replicants.teams[1].primaryColor.value}"></div>
	<div id="rightTeamSecondaryColor" :style="{'background-color': replicants.teams[0].secondaryColor.value}"></div>
	<div id="rightTeamPrimaryColor" :style="{'background-color': replicants.teams[0].primaryColor.value}"></div>
	<div class="left-team-logo">
		<img id="leftTeamLogo" :src="replicants.lowerThird.school2Logo.value">
	</div>
	<div class="right-team-logo">
		<img id="rightTeamLogo" :src="replicants.lowerThird.school1Logo.value">
	</div>
	<div class="leftTeamName">{{replicants.teams[1].schoolName.value}}</div>
	<div class="rightTeamName">{{replicants.teams[0].schoolName.value}}</div>
</template>

<script setup lang="ts">
import Locator from "../../../../../assets/espn/Locator.png"
import {loadReplicants} from "../../../../../browser-common/replicants";

const replicants = await loadReplicants();
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
img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
}
#leftTeamSecondaryColor {
	left: 29.5vw;
	bottom: 22.1vh;
	width: 2.7vw;
	height: 9.6vh;
}
#leftTeamPrimaryColor {
	left: 32.4vw;
	bottom: 22.1vh;
	width: 11.8vw;
	height: 9.6vh;
}
#rightTeamSecondaryColor {
	left: 67.6vw;
	width: 2.7vw;
	bottom: 22.1vh;
	height: 9.6vh;
}
#rightTeamPrimaryColor {
	left: 55.6vw;
	bottom: 22.1vh;
	width: 11.9vw;
	height: 9.6vh;
}
.left-team-logo {
	left: 32.4vw;
	bottom: 22.1vh;
	width: 11.8vw;
	height: 9.6vh;
	display: flex;
	justify-content: center;
}
#leftTeamLogo {
	position: relative;
	height: auto;
	width: auto;
	max-width: 11.9vw;
	max-height: 9.5vh;
}
.right-team-logo {
	left: 55.6vw;
	bottom: 22.1vh;
	width: 11.9vw;
	height: 9.6vh;
	display: flex;
	justify-content: center;
}
#rightTeamLogo {
	position: relative;
	height: auto;
	width: auto;
	max-width: 11.9vw;
	max-height: 9.5vh;
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
