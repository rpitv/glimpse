<template>
	<img :src="Scoreboard">
	<div id="leftFill" :style="{background: replicants.teams[0].primaryColor.value}"></div>
	<div id="rightFill" :style="{background: replicants.teams[1].primaryColor.value}"></div>
	<div class="logo" id="leftLogo">
		<img :src="replicants.lowerThird.school1Logo.value" :alt="replicants.teams[0].name.value">
	</div>
	<div class="logo" id="rightLogo">
		<img :src="replicants.lowerThird.school2Logo.value" :alt="replicants.teams[1].name.value">
	</div>
	<div id="leftTeam"> {{ replicants.teams[0].name.value }}</div>
	<div id="rightTeam"> {{ replicants.teams[1].name.value }}</div>
	<div id="leftScore"> {{ team0Score }}</div>
	<div id="rightScore"> {{ team1Score }}</div>
	<div id="periodText"> {{ period }}</div>
</template>

<script setup lang="ts">
import Scoreboard from "../../../../../assets/rpitv-modern/Scoreboard.png"
import {loadReplicants} from "../../../../../browser-common/replicants";
import {ref, watch} from "vue";

const replicants = await loadReplicants()

const team0Score = ref<number>(replicants.teams[0].score.value);
const team1Score = ref<number>(replicants.teams[1].score.value);
const period = ref<string>();


function periodTextHockey() {
	const scoreboardPeriod = replicants.scoreboard.period.value;
	if (scoreboardPeriod === 1)
		period.value = "End of 1st";
	if (scoreboardPeriod === 2)
		period.value = "End of 2nd";
	// If the team's score are the same and we're nearing the third period...
	if (replicants.teams[0].score.value === replicants.teams[1].score.value) {
		if (scoreboardPeriod === 3)
			period.value = "End of Reg.";
		// If there is no shootout...
		if (!replicants.gameSettings.periods.shootouts.value) {
			// If there is no 2nd overtime...
			if (scoreboardPeriod === 4 && replicants.gameSettings.periods.overtime.count.value < 2)
				period.value = "Final OT";
			// If there is 2nd overtime...
			if (scoreboardPeriod === 4 && replicants.gameSettings.periods.overtime.count.value >= 2)
				period.value = "End 1st OT";
			if (scoreboardPeriod === 5)
				period.value = "Final OT";
		}
		// If there is shootout...
		if (replicants.gameSettings.periods.shootouts.value) {
			// If there is no 2nd overtime...
			if (scoreboardPeriod === 4 && replicants.gameSettings.periods.overtime.count.value < 2)
				period.value = "End of OT";
			if (scoreboardPeriod === 5 && replicants.gameSettings.periods.overtime.count.value < 2)
				period.value = "Final SO";
			// If there is 2nd overtime...
			if (scoreboardPeriod === 4 && replicants.gameSettings.periods.overtime.count.value === 2)
				period.value = "End 1st OT";
			if (scoreboardPeriod === 5 && replicants.gameSettings.periods.overtime.count.value === 2)
				period.value = "End 2nd OT";
			if (scoreboardPeriod === 6 && replicants.gameSettings.periods.overtime.count.value === 2)
				period.value = "Final SO";
		}
	} else {
		// If the team's score are not the same and we're at/past the third period...
		if (scoreboardPeriod === 3)
			period.value = "Final";
		// If there is no shootout...
		if (!replicants.gameSettings.periods.shootouts.value && scoreboardPeriod >= 4)
			period.value = "Final OT";
		// If there is shootout...
		if (replicants.gameSettings.periods.shootouts.value && scoreboardPeriod >= 4) {
			if (scoreboardPeriod >= 4 && scoreboardPeriod <= 5)
				period.value = "Final OT";
			if (scoreboardPeriod === 6)
				period.value = "Final SO";
		}
	}
}

watch(replicants.lowerThird.scoreboard, (newValue, oldValue) => {
	if (newValue) {
		team0Score.value = replicants.teams[0].score.value;
		team1Score.value = replicants.teams[1].score.value;
		// potentially useless 'if' block
		if (replicants.sync.selectedSport.value === "Hockey/Lacrosse" || replicants.sync.selectedSport.value === "Football" ) {
			if (replicants.gameSettings.periods.count.value === 3) {
				periodTextHockey();
			} else { // assuming 4 period max for all other cases (lacrosse)
				const scoreboardPeriod = replicants.scoreboard.period.value;
				if (scoreboardPeriod === 1)
					period.value = "End of 1st";
				else if (scoreboardPeriod === 2)
					period.value = "End of 2nd";
				else if (scoreboardPeriod === 3)
					period.value = "End of 3rd";
				else if (scoreboardPeriod === 4 && team0Score.value === team1Score.value)
					period.value = "End of Regulation";
				else if (scoreboardPeriod === 4)
					period.value = "Final";
				else if (scoreboardPeriod === 5)
					period.value = "End of OT";
			}
		}
	}
})
</script>


<style scoped>
@font-face {
	font-family: "Rubik";
	src: url('../../../../../assets/rpitv-modern/Rubik.ttf');
}

div {
	font-family: 'Rubik', sans-serif;

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

#leftTeam {
	position: absolute;
	left: 0;
	bottom: 17vh;
	width: 67.3vw;
	font-size: 2.5vh;
	text-align: center;
	color: white;
}

#rightTeam {
	position: absolute;
	left: 0;
	bottom: 17vh;
	width: 132.8vw;
	font-size: 2.5vh;
	text-align: center;
	color: white;
}

#leftScore {
	position: absolute;
	left: 0.1vw;
	bottom: 19vh;
	width: 89.3vw;
	font-size: 11vh;
	text-align: center;
	color: white;
}

#rightScore {
	position: absolute;
	left: 0.3vw;
	bottom: 19vh;
	width: 110.1vw;
	font-size: 11vh;
	text-align: center;
	color: white;
}

#periodText {
	position: absolute;
	left: 0;
	bottom: 12vh;
	width: 100vw;
	font-size: 2.2vh;
	text-align: center;
	color: white;
}
</style>
