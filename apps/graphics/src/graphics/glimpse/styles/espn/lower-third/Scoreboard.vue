<template>
	<img :src="scoreboard" alt="lower_third">
	<div id="team1Name" class="lower-third" :style="{'color': replicants.teams[1].primaryColor.value}">
		<p>{{replicants.teams[1].schoolName.value}}</p>
	</div>
	<div  id="team1Score" class="lower-third">
		{{team1Score}}
	</div>
	<div id="team2Name" class="lower-third" :style="{'color': replicants.teams[0].primaryColor.value}">
		<p>{{replicants.teams[0].schoolName.value}}</p>
	</div>
	<div id="team2Score" class="lower-third">
		{{team0Score}}
	</div>
	<div id="gamePeriod" class="lower-third">
		{{period}}
	</div>
	<div class="colors" id="team1PrimaryColor" :style="{'background-color': replicants.teams[1].primaryColor.value}"></div>
	<div class="colors" id="team1SecondaryColor" :style="{'background-color': replicants.teams[1].secondaryColor.value}"></div>
	<div class="colors" id="team2PrimaryColor" :style="{'background-color': replicants.teams[0].primaryColor.value}"></div>
	<div class="colors" id="team2SecondaryColor" :style="{'background-color': replicants.teams[0].secondaryColor.value}"></div>
	<div class="team1Logo">
		<img id="team1Logo" :src="replicants.lowerThird.school2Logo.value">
	</div>
	<div class="team2Logo">
		<img id="team2Logo" :src="replicants.lowerThird.school1Logo.value">
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../../browser-common/replicants";
import {ref, watch} from "vue";
import scoreboard from "../../../../../assets/espn/Scoreboard.png";

const replicants = await loadReplicants();

const team0Score = ref<number>(replicants.teams[0].score.value);
const team1Score = ref<number>(replicants.teams[1].score.value);
const period = replicants.lowerThird.scoreboardDescription;

watch(replicants.scoreboard.visible, (newValue, oldValue) => {
	if (oldValue) {
		team0Score.value = replicants.teams[0].score.value;
		team1Score.value = replicants.teams[1].score.value;
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
#team1Name {
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
#team1Score {
	font-size: 5.7vh;
	width: 84.5vw;
	bottom: 23.7vh;
	height: 5.7vh;
}
#team2Name {
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
#team2Score {
	font-size: 5.7vh;
	width: 115.15vw;
	bottom: 23.7vh;
	height: 5.7vh;
}
#gamePeriod {
	font-size: 2.36vh;
	width: 99.8vw;
	bottom: 12.75vh;
	height: 2.36vh;
	color: white;
}
.colors {
	height: 9.6vh;
	bottom: 21.8vh;
}
#team1SecondaryColor {
	left: 28.6vw;
	width: 1.84vw;
}
#team1PrimaryColor {
	left: 30.7vw;
	width: 8vw;
}
#team2SecondaryColor {
	left: 69.3vw;
	width: 1.93vw;
}
#team2PrimaryColor {
	left: 61.1vw;
	width: 8.1vw;
}
.team1Logo {
	left: 0;
	top: 0;
	width: 69.4vw;
	height: 147vh;
	display: flex;
	justify-content: center;
}
.team2Logo{
	left: 0;
	top: 0;
	width: 130vw;
	height: 147vh;
	display: flex;
	justify-content: center;
}
#team1Logo {
	position: relative;
	margin: auto;
	max-width: 8vw;
	max-height: 9vh;
	height: auto;
	width: auto;
}
#team2Logo {
	position: relative;
	margin: auto;
	max-width: 8vw;
	max-height: 9vh;
	height: auto;
	width: auto;
}
</style>
