<template>
	<img :src="scoreboard" alt="lower_third">
	<div id="leftTeamName" class="lower-third" :style="{'color': replicants.teams[1].primaryColor.value}">
		<p>{{replicants.teams[1].schoolName.value}}</p>
	</div>
	<div id="leftTeamScore" class="lower-third">
		{{ leftTeamScore }}
	</div>
	<div id="rightTeamName" class="lower-third" :style="{'color': replicants.teams[0].primaryColor.value}">
		<p>{{replicants.teams[0].schoolName.value}}</p>
	</div>
	<div id="rightTeamScore" class="lower-third">
		{{ rightTeamScore }}
	</div>
	<div id="gamePeriod" class="lower-third">
		{{period}}
	</div>
	<div class="colors" id="leftTeamPrimaryColor" :style="{'background-color': replicants.teams[1].primaryColor.value}"></div>
	<div class="colors" id="leftTeamSecondaryColor" :style="{'background-color': replicants.teams[1].secondaryColor.value}"></div>
	<div class="colors" id="rightTeamPrimaryColor" :style="{'background-color': replicants.teams[0].primaryColor.value}"></div>
	<div class="colors" id="rightTeamSecondaryColor" :style="{'background-color': replicants.teams[0].secondaryColor.value}"></div>
	<div class="left-team-logo">
		<img id="leftTeamLogo" :src="replicants.lowerThird.school2Logo.value">
	</div>
	<div class="right-team-logo">
		<img id="rightTeamLogo" :src="replicants.lowerThird.school1Logo.value">
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../../browser-common/replicants";
import {ref, watch} from "vue";
import scoreboard from "../../../../../assets/espn/Scoreboard.png";

const replicants = await loadReplicants();

const rightTeamScore = ref<number>(replicants.teams[0].score.value);
const leftTeamScore = ref<number>(replicants.teams[1].score.value);
const period = replicants.lowerThird.scoreboardDescription;

watch(replicants.scoreboard.visible, (newValue, oldValue) => {
	if (oldValue) {
		rightTeamScore.value = replicants.teams[0].score.value;
		leftTeamScore.value = replicants.teams[1].score.value;
		// Periods
		if (replicants.scoreboard.period.value === 1)
			period.value = "End of 1st";
		if (replicants.scoreboard.period.value === 2)
			period.value = "End of 2nd";
		// If the team's score are the same and we're nearing the third period...
		if (replicants.teams[0].score.value === replicants.teams[1].score.value) {
			if (replicants.scoreboard.period.value === 3)
				period.value = "End of Reg.";
			// If there is no shootout...
			if (!replicants.gameSettings.periods.shootouts.value) {
				// If there is no 2nd overtime...
				if (replicants.scoreboard.period.value === 4 && replicants.gameSettings.periods.overtime.count.value < 2)
					period.value = "Final OT";
				// If there is 2nd overtime...
				if (replicants.scoreboard.period.value === 4 && replicants.gameSettings.periods.overtime.count.value >= 2)
					period.value = "End 1st OT";
				if (replicants.scoreboard.period.value === 5)
					period.value = "Final OT";
			}
			// If there is shootout...
			if (replicants.gameSettings.periods.shootouts.value) {
				// If there is no 2nd overtime...
				if (replicants.scoreboard.period.value === 4 && replicants.gameSettings.periods.overtime.count.value < 2)
					period.value = "End of OT";
				if (replicants.scoreboard.period.value === 5 && replicants.gameSettings.periods.overtime.count.value < 2)
					period.value = "Final SO";
				// If there is 2nd overtime...
				if (replicants.scoreboard.period.value === 4 && replicants.gameSettings.periods.overtime.count.value === 2)
					period.value = "End 1st OT";
				if (replicants.scoreboard.period.value === 5 && replicants.gameSettings.periods.overtime.count.value === 2)
					period.value = "End 2nd OT";
				if (replicants.scoreboard.period.value === 6 && replicants.gameSettings.periods.overtime.count.value === 2)
					period.value = "Final SO";
			}
		}
		else {
			// If the team's score are not the same and we're at/past the third period...
			if (replicants.scoreboard.period.value === 3)
				period.value = "Final";
			// If there is no shootout...
			if (!replicants.gameSettings.periods.shootouts.value && replicants.scoreboard.period.value >= 4)
				period.value = "Final OT";
			// If there is shootout...
			if (replicants.gameSettings.periods.shootouts.value && replicants.scoreboard.period.value >= 4) {
				if (replicants.scoreboard.period.value >= 4 && replicants.scoreboard.period.value <= 5)
					period.value = "Final OT";
				if (replicants.scoreboard.period.value === 6)
					period.value = "Final SO";
			}
		}
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
img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;

	transition: opacity 1s;
}
#gamePeriod {
	font-style: italic;
}
.lower-third {
	left: 0;
	text-align: center;
}
#leftTeamName {
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
#leftTeamScore {
	left: 39.1vw;
	bottom: 23.7vh;
	font-size: 5.7vh;
	width: 6.2vw;
	height: 5.7vh;
}
#rightTeamName {
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
#rightTeamScore {
	left: 54.5vw;
	bottom: 23.7vh;
	font-size: 5.7vh;
	width: 6.2vw;
	height: 5.7vh;
}
#gamePeriod {
	left: 44.5vw;
	font-size: 2.36vh;
	width: 11vw;
	bottom: 12.75vh;
	height: 2.36vh;
	color: white;
}
.colors {
	height: 9.6vh;
	bottom: 21.8vh;
}
#leftTeamSecondaryColor {
	left: 28.6vw;
	width: 1.84vw;
}
#leftTeamPrimaryColor {
	left: 30.7vw;
	width: 8vw;
}
#rightTeamSecondaryColor {
	left: 69.3vw;
	width: 1.93vw;
}
#rightTeamPrimaryColor {
	left: 61.1vw;
	width: 8.1vw;
}
.left-team-logo {
	left: 30.7vw;
	bottom: 21.8vh;
	width: 8vw;
	height: 9.6vh;
	display: flex;
	justify-content: center;
}
.right-team-logo{
	left: 61.1vw;
	bottom: 21.8vh;
	width: 8.1vw;
	height: 9.6vh;
	display: flex;
	justify-content: center;
}
#leftTeamLogo {
	position: relative;
	margin: auto;
	max-width: 8vw;
	max-height: 9vh;
	height: auto;
	width: auto;
}
#rightTeamLogo {
	position: relative;
	margin: auto;
	max-width: 8vw;
	max-height: 9vh;
	height: auto;
	width: auto;
}
</style>
