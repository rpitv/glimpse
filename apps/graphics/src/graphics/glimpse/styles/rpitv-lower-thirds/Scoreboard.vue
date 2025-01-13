<template>
	<img class="scoreboard" :src="Scoreboard">
	<div class="colors" :style="leftTeamPrimaryColor">
		<img :style="leftTeamLogo" :src="replicants.lowerThird.scoreboard.leftTeam.logo.value || replicants.teams[1].logo.value" :alt="replicants.teams[1].name.value">
		<div :style="leftTeamName"> {{ replicantScoreboard.leftTeam.name.value || replicants.teams[1].name }}</div>
	</div>
	<div class="colors" :style="rightTeamPrimaryColor">
		<img :style="rightTeamLogo" :src="replicants.lowerThird.scoreboard.rightTeam.logo.value || replicants.teams[0].logo.value" :alt="replicants.teams[0].name.value">
		<div :style="rightTeamName"> {{ replicantScoreboard.rightTeam.name.value || replicants.teams[0].name }}</div>
	</div>
	<div :style="leftTeamScore"> {{ replicantScoreboard.leftTeam.score.value || replicants.teams[1].score }}</div>
	<div :style="rightTeamScore"> {{ replicantScoreboard.rightTeam.score.value || replicants.teams[0].score }}</div>
	<div :style="description">
		{{ replicantScoreboard.description.text.value || period }}
		{{ replicantScoreboard.description.timer.value && replicants.scoreboard.clock.time.value ? `(${formattedClockTime})` : ''}}
	</div>
</template>

<script setup lang="ts">
import Scoreboard from "../../../../assets/rpitv-modern/Scoreboard.png"
import {loadReplicants} from "../../../../browser-common/replicants";
import {computed, type CSSProperties, ref, watch} from "vue";

const replicants = await loadReplicants()

const replicantScoreboard = replicants.lowerThird.scoreboard;

const leftTeamName = computed((): CSSProperties => { return {
	color: replicantScoreboard.leftTeam.nameColor.value,
	fontSize: replicantScoreboard.leftTeam.nameSize.value + 2.5 + "vh",
	position: "relative",
	textAlign: "center",
}});
const leftTeamScore = computed((): CSSProperties => { return {
	alignItems: "center",
	bottom: "16.6vh",
	color: replicantScoreboard.leftTeam.scoreColor.value,
	display: "flex",
	fontSize: replicantScoreboard.leftTeam.scoreSize.value + 11 + "vh",
	height: "17.4vh",
	justifyContent: "space-around",
	left: "39.5vw",
	width: "10.5vw",
}});
const rightTeamName = computed((): CSSProperties => { return {
	color: replicantScoreboard.rightTeam.nameColor.value,
	fontSize: replicantScoreboard.rightTeam.nameSize.value + 2.5 + "vh",
	position: "relative",
	textAlign: "center",
}});
const rightTeamScore = computed((): CSSProperties => { return {
	alignItems: "center",
	bottom: "16.6vh",
	color: replicantScoreboard.rightTeam.scoreColor.value,
	display: "flex",
	fontSize: replicantScoreboard.rightTeam.scoreSize.value + 11 + "vh",
	height: "17.4vh",
	justifyContent: "space-around",
	left: "50vw",
	width: "10.5vw",
}});
const description = computed((): CSSProperties => { return {
	alignItems: "center",
	bottom: "11.5vh",
	color: replicantScoreboard.description.fontColor.value,
	display: "flex",
	fontSize: replicantScoreboard.description.fontSize.value + 2.2 + "vh",
	height: "3.4vh",
	justifyContent: "center",
	left: "42.7vw",
	width: "14.6vw",
}})
const leftTeamPrimaryColor = computed((): CSSProperties => { return {
	alignItems: "center",
	backgroundColor: replicantScoreboard.leftTeam.primaryColor.value,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	left: "29vw",
	width: "9.2vw",
}});
const rightTeamPrimaryColor = computed((): CSSProperties => { return {
	alignItems: "center",
	backgroundColor: replicantScoreboard.rightTeam.primaryColor.value,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	left: "61.8vw",
	width: "9.2vw"
}});
const leftTeamLogo = computed((): CSSProperties => { return {
	height: replicantScoreboard.leftTeam.logoSize.value + "%",
	maxHeight: "14vh",
}});
const rightTeamLogo = computed((): CSSProperties => { return {
	height: replicantScoreboard.rightTeam.logoSize.value + "%",
	maxHeight: "14vh",
}});

const clock = replicants.scoreboard.clock;
const formattedClockTime = computed<string>(() => {
	const minutes = Math.floor(clock.time.value / 60000).toString();
	let seconds = Math.floor((clock.time.value % 60000) / 1000).toString();
	const millis = Math.floor((clock.time.value % 1000) / 100).toString();
	if (minutes === '0') {
		return `${seconds}.${millis}`;
	} else {
		// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
		seconds = seconds.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}
});
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

// watch(replicants.lowerThird.scoreboard, (newValue, oldValue) => {
// 	if (newValue) {
// 		team0Score.value = replicants.teams[0].score.value;
// 		team1Score.value = replicants.teams[1].score.value;
// 		// potentially useless 'if' block
// 		if (replicants.sync.selectedSport.value === "Hockey/Lacrosse" || replicants.sync.selectedSport.value === "Football" ) {
// 			if (replicants.gameSettings.periods.count.value === 3) {
// 				periodTextHockey();
// 			} else { // assuming 4 period max for all other cases (lacrosse)
// 				const scoreboardPeriod = replicants.scoreboard.period.value;
// 				if (scoreboardPeriod === 1)
// 					period.value = "End of 1st";
// 				else if (scoreboardPeriod === 2)
// 					period.value = "End of 2nd";
// 				else if (scoreboardPeriod === 3)
// 					period.value = "End of 3rd";
// 				else if (scoreboardPeriod === 4 && team0Score.value === team1Score.value)
// 					period.value = "End of Regulation";
// 				else if (scoreboardPeriod === 4)
// 					period.value = "Final";
// 				else if (scoreboardPeriod === 5)
// 					period.value = "End of OT";
// 			}
// 		}
// 	}
// });
</script>


<style scoped>
@font-face {
	font-family: "Rubik";
	src: url('../../../../assets/rpitv-modern/Rubik.ttf');
}
div {
	position: absolute;
	font-family: 'Rubik', sans-serif;
}
.scoreboard {
	position: absolute;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
}
.colors {
	bottom: 16.6vh;
	height: 17.4vh;
}
</style>
