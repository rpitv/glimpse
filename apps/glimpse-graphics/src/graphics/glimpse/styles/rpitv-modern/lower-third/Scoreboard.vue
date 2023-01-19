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
	<div id="leftTeam"> {{replicants.teams[0].name.value}} </div>
	<div id="rightTeam"> {{replicants.teams[1].name.value}} </div>
	<div id="leftScore"> {{replicants.teams[0].score.value}} </div>
	<div id="rightScore"> {{replicants.teams[1].score.value}} </div>
	<div id="periodText"> {{period}}</div>
</template>

<script setup lang="ts">
import Scoreboard from "../../../../../assets/rpitv-modern/Scoreboard.png"
import {loadReplicants} from "../../../../../browser-common/replicants";
import {computed} from "vue";

const replicants = await loadReplicants()
const period = computed(() => {
	if (replicants.scoreboard.period.value === 1)
		return "End of 1st";
	if (replicants.scoreboard.period.value === 2)
		return "End of 2nd";
	// If the team's score are the same and we're nearing the third period...
	if (replicants.teams[0].score.value === replicants.teams[1].score.value) {
		if (replicants.scoreboard.period.value === 3)
			return "End of Reg.";
		// If there is no shootout...
		if (!replicants.gameSettings.periods.shootouts.value) {
			// If there is no 2nd overtime...
			if (replicants.scoreboard.period.value === 4 && replicants.gameSettings.periods.overtime.count.value < 2)
				return "Final OT";
			// If there is 2nd overtime...
			if (replicants.scoreboard.period.value === 4 && replicants.gameSettings.periods.overtime.count.value >= 2)
				return "End 1st OT";
			if (replicants.scoreboard.period.value === 5)
				return "Final OT";
		}
		// If there is shootout...
		if (replicants.gameSettings.periods.shootouts.value) {
			// If there is no 2nd overtime...
			if (replicants.scoreboard.period.value === 4 && replicants.gameSettings.periods.overtime.count.value < 2)
				return "End of OT";
			if (replicants.scoreboard.period.value === 5 && replicants.gameSettings.periods.overtime.count.value < 2)
				return "Final SO";
			// If there is 2nd overtime...
			if (replicants.scoreboard.period.value === 4 && replicants.gameSettings.periods.overtime.count.value === 2)
				return "End 1st OT";
			if (replicants.scoreboard.period.value === 5 && replicants.gameSettings.periods.overtime.count.value === 2)
				return "End 2nd OT";
			if (replicants.scoreboard.period.value === 6 && replicants.gameSettings.periods.overtime.count.value === 2)
				return "Final SO";
		}
	}
	// If the team's score are not the same and we're at/past the third period...
	if (replicants.scoreboard.period.value === 3)
		return "Final";
	// If there is no shootout...
	if (!replicants.gameSettings.periods.shootouts.value && replicants.scoreboard.period.value >= 4)
		return "Final OT";
	// If there is shootout...
	if (replicants.gameSettings.periods.shootouts.value && replicants.scoreboard.period.value >= 4) {
		if (replicants.scoreboard.period.value >= 4 && replicants.scoreboard.period.value <= 5)
			return "Final OT";
		if (replicants.scoreboard.period.value === 6)
			return "Final SO";
	}
})
</script>


<style scoped>
@font-face{
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
	left: 0;
	bottom: 18.2vh;
	width: 89.3vw;
	font-size: 12.5vh;
	text-align: center;
	color: white;
}
#rightScore {
	position: absolute;
	left: 0;
	bottom: 18.2vh;
	width: 110.1vw;
	font-size: 12.5vh;
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
