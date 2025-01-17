<template>
    <div class="scoreboard-container">
        <div class="scoreboard" :style="scoreboard">
            <img class="player-img" :src="playerBio.image.url.value ?? ''">
            <div :style="action">
                {{ playerBio.action.description.value ? playerBio.action.description.value : "" }}
                {{ playerBio.action.player.number.value ? "#" + playerBio.action.player.number.value: "" }}
                {{ playerBio.action.player.name.value ?? "" }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { loadReplicants } from '../../../../browser-common/replicants';
import { computed, ref, type CSSProperties} from "vue";
import {calcLinearGrad, isLighter, isLightColor} from "../../../../dashboard/util";

const replicants = await loadReplicants();
const playerBio = replicants.lowerThird.playerBio;
const linearGrad = ref<string>("");

const teamColor = computed(() => {
	let color = ""
	if (!playerBio.image.syncTeamColor.value ) {
		// sync team colors disabled, check for override before default
		if (playerBio.image.defaultTeamColor.value !== "" && playerBio.image.defaultTeamColor.value !== null) {
			color = playerBio.image.defaultTeamColor.value
		} else {
			if (playerBio.action.player.teamSide.value === "leftTeam") {
				color = playerBio.image.leftTeamColor.value
			} else if (playerBio.action.player.teamSide.value === "rightTeam") {
				color = playerBio.image.rightTeamColor.value
			}
		}
	} else {
		// team colors synced
		if (playerBio.action.player.teamSide.value === "leftTeam") {
			color = replicants.teams[1].primaryColor.value
		} else if (playerBio.action.player.teamSide.value === "rightTeam") {
			color = replicants.teams[0].primaryColor.value
		}
	}
	linearGrad.value = calcLinearGrad(color);
	return color
})

const scoreboard = computed((): CSSProperties => {
	return {
		position: "fixed",
        color: isLightColor(teamColor.value) ? "white" : "black",
		background: isLighter(teamColor.value, linearGrad.value) ? `linear-gradient(${teamColor.value}, ${(linearGrad.value)})` : `linear-gradient(${linearGrad.value}, ${(teamColor.value)})`,
		bottom: playerBio.offset.value + 5.93 + "vh",
		display: "flex",
		height: "10.2vh",
		overflow: "hidden",
		width: "77.35vw",
	}
});

const action = computed((): CSSProperties => {
	return {
		color: "white",
		display: "flex",
		alignItems: "center",
		bottom: playerBio.offset.value + 10 + "vh",
		height: "9.7vh",
		marginLeft: "3vw",
		fontSize: playerBio.action.fontSize.value + 7 + "vh",
	}
});

</script>

<style scoped>
@font-face {
	font-family: "Roboto Condensed";
	src: url("../../../../assets/football/RobotoCondensed-Bold.ttf") format('truetype');
}

.scoreboard-container {
	display: flex;
    font-family: "Roboto Condensed";
	justify-content: center;
}


.scoreboard {
	display: flex;
	color: black;
	font-weight: bolder;
	text-shadow: 2px 2px 4px #292929;
	border-radius: 2vh 2vh 2vh 2vh;
	filter: drop-shadow(1vh 1vh 1vh #111111);
}

.player-img {
	position: relative;
	top: 2vh;
	height: 100%;
	width: auto;
	scale: 1.5;
	left: 0.8vw;
}
</style>
