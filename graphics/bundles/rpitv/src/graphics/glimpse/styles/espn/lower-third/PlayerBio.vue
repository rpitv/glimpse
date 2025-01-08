<template>
	<img :src="PlayerBio">
	<div :style="imageBackground">
		<div class="image-container">
			<img class="player-img" :src="playerBio.image.url.value ?? ''">
		</div>
	</div>
	<div :style="action">
		{{ playerBio.action.description.value ? playerBio.action.description.value : "" }}
		{{ playerBio.action.player.number.value ? "#" + playerBio.action.player.number.value: "" }}
		{{ playerBio.action.player.name.value ?? "" }}
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../../browser-common/replicants";
import PlayerBio from "../../../../../assets/espn/playerBio.png";
import { computed, CSSProperties } from "vue";

const replicants = await loadReplicants();
const playerBio = replicants.lowerThird.playerBio;


const imageBackground = computed((): CSSProperties => {
	return {
		position: "absolute",
		backgroundColor: !playerBio.image.syncTeamColor.value && playerBio.action.player.teamSide.value === "leftTeam" ? playerBio.image.leftTeamColor.value : 
			(!playerBio.image.syncTeamColor.value && playerBio.action.player.teamSide.value === "rightTeam" ? playerBio.image.rightTeamColor.value : 
			(playerBio.action.player.teamSide.value === "leftTeam" ? replicants.teams[1].primaryColor.value : (playerBio.action.player.teamSide.value === "rightTeam" ? replicants.teams[0].primaryColor.value : ""))),
		bottom: playerBio.offset.value + 9.45 + "vh",
		display: "flex",
		justifyContent: "center",
		height: "10.7vh",
		left: "14.7vw",
		overflow: "hidden",
		width: "11.3vw",
	}
});

const action = computed((): CSSProperties => {
	return {
		color: "#3F3F3F",
		display: "flex",
		alignItems: "center",
		position: "absolute",
		bottom: playerBio.offset.value + 10 + "vh",
		height: "9.7vh",
		left: "26.5vw",
		marginLeft: "1vw",
		width: "58.5vw",
		fontSize: playerBio.action.fontSize.value + 5 + "vh",
	}
});
</script>

<style scoped lang="scss">
img {
	height: 100vh;
	width: 100vw;
}

@font-face {
	font-family: "swiss721_heavy";
	src: url('../../../../../assets/espn/Swiss721Heavy.ttf')
}
div {
	position: absolute;
	font-family: "swiss721_heavy";
}
.player-img {
	position: relative;
	top: 2vh;
	height: 100%;
	width: auto;
	scale: 1.5;
	left: 2.7vw;
}

.image-container {
	display: flex;
	justify-content: center;
	height: 100%;
}
</style>
